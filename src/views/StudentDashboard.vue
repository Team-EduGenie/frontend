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
                    <button class="review-button" @click="reviewQuiz(quiz.id)">
                      다시 풀어보기
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
      problemSets: [
        { id: 1, name: "KT Azure Cloud 자격증", score: 85 },
        { id: 2, name: "KT AI 역량 인증", score: 92 },
        { id: 3, name: "KT Cloud MSA", score: 78 },
        { id: 4, name: "KT DevOps 인증", score: 88 }
      ],
      wrongQuizzes: [
        {
          id: 1,
          number: 1,
          question: "Azure Virtual Machine의 가용성 집합(Availability Set)에서 장애 도메인(Fault Domain)의 최대 개수는?",
          userAnswer: "5개",
          correctAnswer: "3개",
          date: "2024-03-15"
        },
        {
          id: 2,
          number: 2,
          question: "Azure Kubernetes Service(AKS)에서 노드 풀(Node Pool)을 스케일링하는 가장 효율적인 방법은?",
          userAnswer: "수동으로 노드 수 조정",
          correctAnswer: "Cluster Autoscaler 사용",
          date: "2024-03-15"
        },
        {
          id: 3,
          number: 3,
          question: "Azure에서 컨테이너 레지스트리(Container Registry)의 이미지 태그가 변경되지 않도록 보호하는 기능은?",
          userAnswer: "Image Lock",
          correctAnswer: "Tag Lock",
          date: "2024-03-14"
        }
      ],
      chart: null
    }
  },
  methods: {
    selectSet(setId) {
      if (this.selectedSet === setId) {
        this.selectedSet = null;
        this.$nextTick(() => {
          this.initChart();
        });
      } else {
        this.selectedSet = setId;
        // TODO: API 호출하여 해당 문제 세트의 틀린 문제 목록 가져오기
      }
    },
    reviewQuiz(quizId) {
      // TODO: 문제 다시 풀기 페이지로 이동
      console.log('Review quiz:', quizId);
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
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
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
}

.review-button:hover {
  background: #ff5252;
  transform: translateY(-2px);
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