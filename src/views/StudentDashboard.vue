<template>
  <div class="student-dashboard">
    <h1>나의 학습 현황 📊</h1>
    <div class="dashboard-container">
      <!-- 과목 선택 섹션 -->
      <div class="subject-selector">
        <h2>문제 세트 선택</h2>
        <div class="subject-list">
          <div 
            v-for="set in problemSets" 
            :key="set.id"
            :class="['subject-item', { active: selectedSet === set.id }]"
            @click="selectSet(set.id)"
          >
            <span class="subject-icon">📝</span>
            <span class="subject-name">{{ set.name }}</span>
          </div>
        </div>
      </div>

      <!-- 틀린 문제 목록 또는 차트 섹션 -->
      <div class="content-section">
        <template v-if="selectedSet">
          <div class="wrong-answers">
            <h2>틀린 문제 목록</h2>
            <div class="quiz-list">
              <div v-for="quiz in wrongQuizzes" :key="quiz.id" class="quiz-item">
                <div class="quiz-header">
                  <span class="quiz-number">문제 {{ quiz.number }}</span>
                  <span class="quiz-date">{{ quiz.date }}</span>
                </div>
                <div class="quiz-content">
                  <p class="quiz-question">{{ quiz.question }}</p>
                  <div class="quiz-details">
                    <div class="answer-info">
                      <span class="wrong-answer">내가 선택한 답: {{ quiz.userAnswer }}</span>
                      <span class="correct-answer">정답: {{ quiz.correctAnswer }}</span>
                    </div>
                    <button class="review-button disabled" disabled>
                      <span class="button-icon">🤖</span>
                      <span class="button-text">AI 해설 보기</span>
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="wrongQuizzes.length === 0" class="no-quizzes">
                선택한 문제 세트에 틀린 문제가 없습니다.
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="score-chart">
            <h2>시험별 성적 현황</h2>
            <div class="chart-container">
              <canvas ref="scoreChart"></canvas>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- 뒤로가기 버튼 추가 -->
    <div class="back-button-container">
      <button @click="goBack" class="back-button">
        <span class="back-icon">←</span>
        메인 메뉴로 돌아가기
      </button>
    </div>
  </div>
</template>

<script>
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController } from 'chart.js'
import axios from 'axios'

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'StudentDashboard',
  data() {
    return {
      selectedSet: null,
      problemSets: [],
      wrongQuizzes: [],
      chart: null
    }
  },
  methods: {
    async fetchSubjects() {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const groupId = userInfo?.groupInfo?.groupId;
        
        if (!groupId) {
          console.error('그룹 정보를 찾을 수 없습니다.');
          return;
        }

        // 과목 목록 가져오기
        const response = await axios.get('/subjects', {
          params: { groupId }
        });

        if (response.data.success) {
          this.problemSets = response.data.subjects.map(subject => ({
            id: subject.id,
            name: subject.name
          }));

          // 각 과목의 점수 정보 가져오기
          const scoresResponse = await axios.get('/leaderboard', {
            params: { groupId }
          });

          if (scoresResponse.data.success) {
            // 각 과목별 점수 정보를 problemSets에 추가
            this.problemSets = this.problemSets.map(set => ({
              ...set,
              score: scoresResponse.data.scores[set.id] || 0
            }));

            // 차트 초기화
            this.$nextTick(() => {
              this.initChart();
            });
          }
        }
      } catch (error) {
        console.error('과목 목록을 가져오는데 실패했습니다:', error);
      }
    },

    async fetchWrongQuizzes(subjectId) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const userId = userInfo?.userId;
        
        if (!userId) {
          console.error('사용자 정보를 찾을 수 없습니다.');
          return;
        }

        // 틀린 문제 목록 가져오기
        const response = await axios.get('/quiz-user/wrong', {
          params: {
            subjectId,
            userId
          }
        });

        if (response.data.success) {
          this.wrongQuizzes = response.data.wrongQuizzes.map(quiz => ({
            id: quiz.quizId,
            number: quiz.number,
            question: quiz.question,
            userAnswer: quiz.userAnswer,
            correctAnswer: quiz.correctAnswer,
            date: new Date(quiz.createTime).toLocaleDateString('ko-KR')
          }));
        }
      } catch (error) {
        console.error('틀린 문제 목록을 가져오는데 실패했습니다:', error);
      }
    },

    async selectSet(setId) {
      if (this.selectedSet === setId) {
        this.selectedSet = null;
        this.wrongQuizzes = [];
        this.$nextTick(() => {
          this.initChart();
        });
      } else {
        this.selectedSet = setId;
        await this.fetchWrongQuizzes(setId);
      }
    },

    reviewQuiz(quizId) {
      this.$router.push({
        path: '/exam',
        query: {
          subjectId: this.selectedSet,
          quizId: quizId
        }
      });
    },

    initChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.scoreChart.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.problemSets.map(set => set.name),
          datasets: [{
            label: '시험 점수',
            data: this.problemSets.map(set => set.score),
            backgroundColor: '#ff6b6b',
            borderColor: '#ff5252',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '점';
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.parsed.y + '점';
                }
              }
            }
          }
        }
      });
    },
    goBack() {
      this.$router.push('/studentmenu');
    }
  },
  async created() {
    await this.fetchSubjects();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
</script>

<style scoped>
.student-dashboard {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #fff5f5;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(255,182,193,0.3) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(255,218,185,0.3) 0%, transparent 20%);
}

h1 {
  color: #ff6b6b;
  margin-bottom: 30px;
  font-size: 2.5em;
  text-align: center;
}

.dashboard-container {
  display: flex;
  gap: 30px;
}

.subject-selector {
  width: 300px;
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.subject-selector h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.subject-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.subject-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.subject-item:hover {
  background: #fff5f5;
  transform: translateY(-2px);
}

.subject-item.active {
  background: #ff6b6b;
  color: white;
}

.subject-icon {
  font-size: 1.2em;
}

.subject-name {
  font-size: 1.1em;
  font-weight: 500;
}

.content-section {
  flex: 1;
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-height: 500px;
}

.wrong-answers {
  width: 100%;
}

.wrong-answers h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.quiz-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quiz-item {
  background: #fff5f5;
  border-radius: 12px;
  padding: 20px;
  transition: transform 0.3s ease;
}

.quiz-item:hover {
  transform: translateY(-2px);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.quiz-number {
  font-weight: bold;
  color: #ff6b6b;
}

.quiz-date {
  color: #5c6b7a;
  font-size: 0.9em;
}

.quiz-question {
  color: #2c3e50;
  font-size: 1.1em;
  margin-bottom: 15px;
}

.quiz-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.answer-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.wrong-answer {
  color: #ff6b6b;
}

.correct-answer {
  color: #4CAF50;
}

.review-button {
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.review-button:hover:not(.disabled) {
  background: #ff5252;
  transform: translateY(-2px);
}

.review-button.disabled {
  background: #adb5bd;
  cursor: not-allowed;
  opacity: 0.7;
}

.button-icon {
  font-size: 1.1em;
}

.no-quizzes, .no-subject {
  text-align: center;
  color: #5c6b7a;
  padding: 40px;
  font-size: 1.1em;
}

.score-chart {
  height: 100%;
  min-height: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.score-chart h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.chart-container {
  height: 400px;
  position: relative;
  flex: 1;
}

.back-button-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: white;
  border: 2px solid #ff6b6b;
  border-radius: 25px;
  color: #ff6b6b;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #ff6b6b;
  color: white;
  transform: translateY(-2px);
}

.back-icon {
  font-size: 1.2em;
}

@media (max-width: 768px) {
  .student-dashboard {
    padding: 20px;
  }

  .dashboard-container {
    flex-direction: column;
  }

  .subject-selector {
    width: 100%;
  }

  h1 {
    font-size: 2em;
  }

  .quiz-item {
    padding: 15px;
  }

  .quiz-details {
    flex-direction: column;
    gap: 15px;
  }

  .review-button {
    width: 100%;
  }

  .score-chart {
    min-height: 300px;
  }

  .chart-container {
    height: 300px;
  }

  .back-button {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}
</style> 