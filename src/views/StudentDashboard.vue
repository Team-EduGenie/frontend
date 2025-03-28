<template>
  <div class="dashboard-view">
    <div class="header">
      <h1>나의 학습 현황 📊</h1>
      <p class="subtitle">오늘도 멋진 성장을 기록해보세요!</p>
    </div>
    
    <div class="dashboard-container">
      <div class="stats-section">
        <div class="stat-card">
          <span class="stat-icon">🎯</span>
          <div class="stat-content">
            <span class="stat-title">오늘의 목표</span>
            <span class="stat-value">{{ todayGoal }}문제</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">⭐</span>
          <div class="stat-content">
            <span class="stat-title">획득 포인트</span>
            <span class="stat-value">{{ totalPoints }}점</span>
          </div>
        </div>
        <div class="stat-card">
          <span class="stat-icon">📚</span>
          <div class="stat-content">
            <span class="stat-title">학습한 과목</span>
            <span class="stat-value">{{ completedSubjects }}개</span>
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="score-table">
          <h2>과목별 성적</h2>
          <table>
            <thead>
              <tr>
                <th>과목</th>
                <th>단원</th>
                <th>난이도</th>
                <th>성취도</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="score in filteredScores" :key="score.unitName">
                <td>{{ getSubjectName(score.subjectId) }}</td>
                <td>{{ score.unitName }}</td>
                <td :class="getDifficultyClass(score.difficulty)">{{ getDifficultyLevel(score.difficulty) }}</td>
                <td :class="getAchievementClass(score.achievement)">{{ score.achievement }}%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="chart-container">
          <h2>과목별 성적 분포</h2>
          <div class="chart-wrapper">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>
      </div>
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
      chart: null,
      selectedSubject: 'all',
      todayGoal: 10,
      totalPoints: 0,
      completedSubjects: 0
    }
  },
  computed: {
    filteredScores() {
      if (this.selectedSubject === 'all') {
        return this.scores;
      }
      return this.scores.filter(score => score.subjectId === this.selectedSubject);
    }
  },
  watch: {
    selectedSubject() {
      this.updateChart();
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
        const student = JSON.parse(localStorage.getItem('student'));
        if (!student) {
          this.$router.push('/studentlogin');
          return;
        }

        const response = await axiosInst.get(`/student-diff/student/${student.studentId}`);
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
        
        this.updateChart();
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
    updateChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const labels = this.filteredScores.map(score => `${this.getSubjectName(score.subjectId)}\n${score.unitName}`);
      const data = this.filteredScores.map(score => score.achievement);
      
      const ctx = this.$refs.chartCanvas.getContext('2d');
      
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: '성취도 (%)',
            data: data,
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
                  return value + '%';
                }
              },
              title: {
                display: true,
                text: '성취도'
              }
            },
            x: {
              title: {
                display: true,
                text: '과목-단원'
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
                  return `성취도: ${context.raw}%`;
                }
              }
            }
          }
        }
      });
    },
    getDifficultyClass(difficulty) {
      return `difficulty-${difficulty}`;
    },
    getAchievementClass(percentage) {
      if (percentage >= 76) return 'achievement-excellent';
      if (percentage >= 51) return 'achievement-good';
      if (percentage >= 21) return 'achievement-average';
      return 'achievement-poor';
    }
  },
  created() {
    this.fetchScores();
  },
  unmounted() {
    if (this.chart) {
      this.chart.destroy();
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
  width: 100%;
  max-width: 1200px;
  position: relative;
  z-index: 1;
}

.stats-section {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2em;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-title {
  font-size: 0.9em;
  color: #5c6b7a;
}

.stat-value {
  font-size: 1.2em;
  font-weight: bold;
  color: #2c3e50;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-top: 30px;
}

.score-table, .chart-container {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5em;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
}

.chart-wrapper {
  height: 300px;
  margin-top: 20px;
}

.difficulty-3 { color: #4CAF50; }
.difficulty-2 { color: #FF9800; }
.difficulty-1 { color: #f44336; }

.achievement-excellent { color: #4CAF50; }
.achievement-good { color: #2196F3; }
.achievement-average { color: #FF9800; }
.achievement-poor { color: #f44336; }

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

  .stats-section {
    flex-direction: column;
  }

  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .chart-wrapper {
    height: 250px;
  }

  .deco-item {
    font-size: 2em;
  }
}
</style> 