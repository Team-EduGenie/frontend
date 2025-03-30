<template>
  <div class="dashboard-view">
    <div class="header">
      <h1>나의 학습 현황 📊</h1>
      <p class="subtitle">오늘도 멋진 성장을 기록해보세요!</p>
    </div>
    
    <div class="dashboard-container">
      <!-- 왼쪽 리더보드 -->
      <div class="leaderboard-section">
        <h2>리더보드</h2>
        <div class="leaderboard">
          <div class="leaderboard-header">
            <span>순위</span>
            <span>이름</span>
            <span>점수</span>
            <span>풀이시간</span>
          </div>
          <div v-for="(user, index) in leaderboardData" 
               :key="index" 
               class="leaderboard-row"
               :class="{ 'current-user': user.userName === '홍길동' }">
            <span>{{ user.rank }}</span>
            <span>{{ user.userName }}</span>
            <span>{{ user.score }}</span>
            <span>{{ user.solvingTime }}</span>
          </div>
        </div>
      </div>

      <!-- 오른쪽 섹션 -->
      <div class="right-section">
        <template v-if="isLeader">
          <h2>그룹원 성적 현황</h2>
          <div class="chart-container">
            <canvas ref="groupChart"></canvas>
          </div>
        </template>
        <template v-else>
          <h2>틀린 문제</h2>
          <div class="wrong-questions">
            <div v-for="(question, index) in wrongQuestions" 
                 :key="index" 
                 class="question-card">
              <div class="question-header">
                <span class="difficulty" :class="question.difficulty.toLowerCase()">
                  {{ question.difficulty }}
                </span>
                <button @click="toggleExplanation(index)" class="toggle-btn">
                  {{ question.showExplanation ? '접기' : '더보기' }}
                </button>
              </div>
              <div class="question-content">
                <p class="question-text">{{ question.question }}</p>
                <div v-if="question.showExplanation" class="explanation-section">
                  <p class="answer">정답: {{ question.answer }}</p>
                  <p class="explanation">{{ question.explanation }}</p>
                  <button @click="startChat(question)" class="chat-btn">
                    GPT와 대화하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 이전으로 돌아가기 버튼 -->
    <div class="back-button-container">
      <button @click="goBack" class="back-button">
        <span class="back-icon">←</span>
        이전으로 돌아가기
      </button>
    </div>

    <div class="decoration">
      <span class="deco-item star1">⭐</span>
      <span class="deco-item star2">✨</span>
      <span class="deco-item heart">💖</span>
      <span class="deco-item rainbow">🌈</span>
      <span class="deco-item magic">🪄</span>
    </div>
  </div>
</template>

<script>
import axiosInst from '../axios'
import { 
  Chart, 
  BarElement, 
  BarController,
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend 
} from 'chart.js'

Chart.register(
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

export default {
  name: 'StudentDashboard',
  data() {
    return {
      scores: [],
      subjects: [],
      selectedSubject: 'all',
      todayGoal: 10,
      totalPoints: 0,
      completedSubjects: 0,
      leaderboardData: [
        { rank: 1, userName: '김철수', score: 95, solvingTime: '45분' },
        { rank: 2, userName: '홍길동', score: 90, solvingTime: '50분' },
        { rank: 3, userName: '이영희', score: 85, solvingTime: '55분' },
        { rank: 4, userName: '박지성', score: 80, solvingTime: '60분' },
        { rank: 5, userName: '최민수', score: 75, solvingTime: '65분' }
      ],
      wrongQuestions: [
        {
          difficulty: 'HARD',
          question: '다음 중 JavaScript의 비동기 처리 방식이 아닌 것은?',
          answer: 'Synchronous',
          explanation: 'JavaScript는 기본적으로 비동기 처리를 지원하며, Promise, async/await, callback 등의 방식을 사용합니다.',
          showExplanation: false
        },
        {
          difficulty: 'MEDIUM',
          question: 'Vue.js의 라이프사이클 훅 중 컴포넌트가 마운트된 직후에 호출되는 것은?',
          answer: 'mounted',
          explanation: 'mounted 훅은 컴포넌트가 DOM에 마운트된 직후에 호출되며, 이 시점에서 DOM 조작이 가능합니다.',
          showExplanation: false
        }
      ],
      isLeader: false,
      groupChart: null,
      groupMembers: [
        { name: '홍길동', score: 90, subject: '수학' },
        { name: '김철수', score: 85, subject: '수학' },
        { name: '이영희', score: 95, subject: '수학' },
        { name: '박지성', score: 88, subject: '수학' },
        { name: '최민수', score: 92, subject: '수학' }
      ]
    }
  },
  methods: {
    getSubjectName(subjectId) {
      const subject = this.subjects.find(s => s.subjectId === subjectId);
      return subject ? subject.subjectName : '';
    },
    getDifficultyLevel(difficulty) {
      if (difficulty === 3) return '상';
      if (difficulty === 2) return '중';
      if (difficulty === 1) return '하';
      return '미흡';
    },
    getAchievementLevel(percentage) {
      if (percentage >= 76) return '매우 우수';
      if (percentage >= 51) return '우수';
      if (percentage >= 21) return '보통';
      return '미흡';
    },
    async fetchScores() {
      try {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
          this.$router.push('/studentlogin');
          return;
        }

        const response = await axiosInst.get(`/student-diff/student/${user.id}`);
        this.scores = response.data.map(score => ({
          subjectId: this.getSubjectIdByUnitName(score.unitName),
          unitName: score.unitName,
          difficulty: score.difficulty,
          achievement: score.achievement
        }));
        
        const subjectsResponse = await axiosInst.get('/subjects');
        this.subjects = subjectsResponse.data;
        
        // 통계 데이터 업데이트
        this.completedSubjects = new Set(this.scores.map(score => score.subjectId)).size;
        this.totalPoints = this.scores.reduce((sum, score) => sum + (score.achievement * 10), 0);
      } catch (error) {
        console.error('성적 조회 실패:', error);
        this.scores = [];
        this.subjects = [];
      }
    },
    getSubjectIdByUnitName(unitName) {
      if (unitName === '받아쓰기' || unitName === '읽기' || unitName === '맞춤법') return 12;
      if (unitName === '역사' || unitName === '정치' || unitName === '경제') return 13;
      if (unitName === '식물' || unitName === '동물' || unitName === '지구') return 14;
      if (unitName === '사칙연산' || unitName === '창의력' || unitName === '수식') return 15;
      return 0;
    },
    getDifficultyClass(difficulty) {
      return `difficulty-${difficulty}`;
    },
    getAchievementClass(percentage) {
      if (percentage >= 76) return 'achievement-excellent';
      if (percentage >= 51) return 'achievement-good';
      if (percentage >= 21) return 'achievement-average';
      return 'achievement-poor';
    },
    toggleExplanation(index) {
      this.wrongQuestions[index].showExplanation = !this.wrongQuestions[index].showExplanation;
    },
    startChat(question) {
      // GPT와의 대화 기능 구현 예정
      console.log('Start chat with GPT about:', question);
    },
    goBack() {
      this.$router.push('/studentmenu');
    },
    checkUserRole() {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user) {
        this.isLeader = user.role === 'leader';
        if (this.isLeader) {
          // DOM이 마운트된 후에 차트 초기화
          this.$nextTick(() => {
            this.initializeGroupChart();
          });
        }
      }
    },
    initializeGroupChart() {
      const ctx = this.$refs.groupChart.getContext('2d');
      this.groupChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.groupMembers.map(member => member.name),
          datasets: [{
            label: '과목별 성적',
            data: this.groupMembers.map(member => member.score),
            backgroundColor: '#ff8787',
            borderColor: '#ff6b6b',
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
                stepSize: 20,
                callback: function(value) {
                  return value + '점';
                }
              },
              title: {
                display: true,
                text: '점수'
              }
            },
            x: {
              title: {
                display: true,
                text: '그룹원'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: function(context) {
                  return `점수: ${context.raw}점`;
                }
              }
            }
          }
        }
      });
    }
  },
  created() {
    this.fetchScores();
  },
  mounted() {
    this.checkUserRole();
  },
  unmounted() {
    if (this.groupChart) {
      this.groupChart.destroy();
    }
  }
}
</script>

<style scoped>
.dashboard-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #fff5f5;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(255,182,193,0.3) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(255,218,185,0.3) 0%, transparent 20%);
  position: relative;
  overflow: hidden;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  color: #ff6b6b;
  margin-bottom: 10px;
  font-size: 3em;
  text-align: center;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(255,107,107,0.2);
  width: fit-content;
}

.subtitle {
  color: #ff8787;
  font-size: 1.6em;
  margin-top: 10px;
  font-weight: 500;
  width: fit-content;
}

.dashboard-container {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 60vh;
  background-color: #f5f7fa;
}

.leaderboard-section,
.right-section {
  flex: 1;
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 0;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
}

.leaderboard {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.leaderboard-header {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  gap: 1rem;
  padding: 0.8rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  font-weight: bold;
  color: #495057;
}

.leaderboard-row {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  gap: 1rem;
  padding: 0.8rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.leaderboard-row:hover {
  background-color: #f8f9fa;
}

.current-user {
  background-color: #e3f2fd;
  border: 2px solid #2196f3;
}

.question-card {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.difficulty {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-weight: bold;
  font-size: 0.9rem;
}

.difficulty.hard {
  background-color: #ffebee;
  color: #c62828;
}

.difficulty.medium {
  background-color: #fff3e0;
  color: #ef6c00;
}

.difficulty.easy {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.toggle-btn {
  background: none;
  border: none;
  color: #2196f3;
  cursor: pointer;
  font-weight: bold;
}

.question-content {
  margin-top: 1rem;
}

.question-text {
  color: #2c3e50;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.explanation-section {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-top: 1rem;
}

.answer {
  color: #2196f3;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.explanation {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.chat-btn {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.chat-btn:hover {
  background-color: #1976d2;
}

.decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.deco-item {
  position: absolute;
  font-size: 2.5em;
  animation: float 4s ease-in-out infinite;
}

.star1 { top: 15%; left: 10%; animation-delay: 0s; }
.star2 { top: 25%; right: 15%; animation-delay: 1s; }
.heart { bottom: 20%; left: 15%; animation-delay: 2s; }
.rainbow { bottom: 30%; right: 10%; animation-delay: 1.5s; }
.magic { top: 40%; left: 50%; animation-delay: 0.5s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5em;
  }

  .subtitle {
    font-size: 1.3em;
  }

  .dashboard-container {
    flex-direction: column;
    padding: 1rem;
  }

  .deco-item {
    font-size: 2em;
  }

  .chart-container {
    height: 300px;
  }
}

.back-button-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: #fff;
  border: 2px solid #ff6b6b;
  border-radius: 25px;
  color: #ff6b6b;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.2);
}

.back-button:hover {
  background-color: #ff6b6b;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 107, 107, 0.3);
}

.back-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.chart-container {
  width: 100%;
  height: 400px;
  margin-top: 1rem;
  background: white;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
}

.right-section {
  flex: 1;
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style> 