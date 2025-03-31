<template>
  <div class="manager-dashboard">
    <h1>그룹 학습 현황 📊</h1>
    <div class="dashboard-container">
      <div class="leaderboard">
        <h2>리더보드</h2>
        <div class="leaderboard-list">
          <div v-for="(user, index) in sortedUsers" :key="user.id" class="leaderboard-item">
            <div class="rank">{{ index + 1 }}</div>
            <div class="user-info">
              <span class="user-name">{{ user.name }}</span>
              <div class="score-info">
                <span class="score">{{ user.score }}점</span>
                <span class="quiz-count">{{ user.quizCount }}문제 완료</span>
              </div>
            </div>
          </div>
        </div>
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
export default {
  name: 'ManagerDashboard',
  data() {
    return {
      users: [
        { id: 1, name: "김학생", score: 95, quizCount: 20 },
        { id: 2, name: "이학생", score: 88, quizCount: 18 },
        { id: 3, name: "박학생", score: 85, quizCount: 15 },
        { id: 4, name: "최학생", score: 82, quizCount: 17 },
        { id: 5, name: "정학생", score: 78, quizCount: 14 }
      ]
    }
  },
  computed: {
    sortedUsers() {
      return [...this.users].sort((a, b) => b.score - a.score);
    }
  },
  methods: {
    goBack() {
      this.$router.push('/studentmenu');
    }
  }
}
</script>

<style scoped>
.manager-dashboard {
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

.leaderboard {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  flex: 1;
}

.leaderboard h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.8em;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #fff5f5;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.leaderboard-item:hover {
  transform: translateY(-2px);
}

.rank {
  width: 40px;
  height: 40px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2em;
  margin-right: 15px;
}

.user-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-name {
  font-size: 1.1em;
  font-weight: 500;
  color: #2c3e50;
}

.score-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.score {
  color: #ff6b6b;
  font-weight: bold;
  font-size: 1.1em;
}

.quiz-count {
  color: #5c6b7a;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .manager-dashboard {
    padding: 20px;
  }

  h1 {
    font-size: 2em;
  }

  .leaderboard h2 {
    font-size: 1.5em;
  }

  .leaderboard-item {
    padding: 12px;
  }

  .rank {
    width: 35px;
    height: 35px;
    font-size: 1.1em;
  }

  .user-name {
    font-size: 1em;
  }

  .score {
    font-size: 1em;
  }

  .quiz-count {
    font-size: 0.8em;
  }

  .back-button {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
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
</style> 