<template>
  <div class="teacher-menu">
    <div class="menu-container">
      <h1>학부모 메뉴 🎨</h1>
      <div class="menu-buttons">
        <button @click="goToScoreManagement" class="menu-button score-button">
          <span class="button-icon">📊</span>
          우리 아이 성적 관리
        </button>
        <button @click="goToStudentManagement" class="menu-button student-button">
          <span class="button-icon">👨‍👧‍👦</span>
          자녀등록
        </button>
        <button @click="generateQuizzes" class="menu-button generate-button">
          <div>
            <span class="button-icon">✏️</span>
            새로운 문제 만들기
          </div>
        </button>
        <button @click="logout" class="menu-button logout-button">
          <span class="button-icon">👋</span>
          로그아웃
        </button>
      </div>
    </div>

    <!-- 로딩 표시 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner">🔄</div>
        <p>문제를 생성하고 있습니다...</p>
        <p class="loading-subtext">잠시만 기다려주세요</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../../axios';

export default {
  name: 'TeacherMenu',
  data() {
    return {
      isLoading: false
    }
  },
  created() {
    const teacherId = localStorage.getItem('teacherId');
    if (!teacherId) {
      this.$router.push('/teacherlogin');
    }
  },
  methods: {
    goToScoreManagement() {
      this.$router.push('/teacherstudentselect');
    },
    goToStudentManagement() {
      this.$router.push('/students');
    },
    async generateQuizzes() {
      try {
        this.isLoading = true;
        const response = await axios.post('/api/quiz-generator/initialize');
        alert('문제 생성이 완료되었습니다!');
      } catch (error) {
        console.error('문제 생성 중 오류 발생:', error);
        alert('문제 생성 중 오류가 발생했습니다.');
      } finally {
        this.isLoading = false;
      }
    },
    logout() {
      localStorage.removeItem('teacher');
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.teacher-menu {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f6fa;
  position: relative;
}

.menu-container {
  background-color: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.menu-button {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #fff;
  color: #2c3e50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button-icon {
  margin-right: 1rem;
  font-size: 1.5rem;
}

.score-button {
  background-color: #74b9ff;
  color: white;
}

.student-button {
  background-color: #a8e6cf;
  color: white;
}

.generate-button {
  background-color: #ffd3b6;
  color: #2c3e50;
}

.logout-button {
  background-color: #ff7675;
  color: white;
}

.menu-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-content {
  background-color: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
}

.loading-spinner {
  font-size: 2rem;
  animation: spin 2s linear infinite;
  margin-bottom: 1rem;
}

.loading-subtext {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>