<template>
  <div class="menu-view">
    <div class="header">
      <h1>무엇을 해볼까요? 🤔</h1>
      <p class="subtitle">오늘도 즐거운 공부해요!</p>
    </div>
    <div class="menu-buttons">
      <button @click="goToSubjectGroupSelect" class="menu-button subject">
        <span class="button-icon">📚</span>
        <div class="button-content">
          <span class="button-title">연습 문제</span>
          <span class="button-description">ai가 당신의 성취도를 관리해줍니다!</span>
        </div>
      </button>
      <button @click="goToExam" class="menu-button exam">
        <span class="button-icon">📝</span>
        <div class="button-content">
          <span class="button-title">시험 치기</span>
          <span class="button-description">오늘의 시험을 시작해보세요</span>
        </div>
      </button>
      <button @click="goToReview" class="menu-button score">
        <span class="button-icon">📊</span>
        <div class="button-content">
          <span class="button-title">복습하기</span>
          <span class="button-description">학습한 내용을 다시 한번 확인해보세요</span>
        </div>
      </button>
      <button @click="goToGroup" class="menu-button group">
        <span class="button-icon">👥</span>
        <div class="button-content">
          <span class="button-title">그룹 만들기</span>
          <span class="button-description">친구들과 함께 공부해보세요</span>
        </div>
      </button>
      <button @click="logout" class="menu-button logout">
        <span class="button-icon">👋</span>
        <div class="button-content">
          <span class="button-title">로그아웃</span>
          <span class="button-description">다음에 또 만나요!</span>
        </div>
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

export default {
  name: 'StudentMenu',
  data() {
    return {
      subjects: []
    }
  },
  methods: {
    goToSubjectGroupSelect() {
      this.$router.push('/subject-group-select?from=practice');
    },
    goToExam() {
      this.$router.push('/subject-group-select?from=exam');
    },
    goToReview() {
      localStorage.setItem('student', JSON.stringify({
        id: 1,
        name: '홍길동',
        role: 'student'
      }));
      this.$router.push('/student-dashboard');
    },
    goToGroup() {
      this.$router.push('/group');
    },
    logout() {
      localStorage.removeItem('student');
      this.$router.push('/');
    }
  },
  async created() {
    try {
      const response = await axiosInst.get('/subjects');
      this.subjects = response.data;
    } catch (error) {
      console.error('과목 목록을 가져오는데 실패했습니다:', error);
    }
  }
}
</script>

<style scoped>
.menu-view {
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

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 1;
}

.menu-button {
  padding: 25px 30px;
  font-size: 1.2em;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 20px;
  text-align: left;
  border: 3px solid transparent;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.button-icon {
  font-size: 2em;
  transition: transform 0.3s ease;
}

.button-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.button-title {
  font-size: 1.3em;
  font-weight: bold;
  color: #2c3e50;
}

.button-description {
  font-size: 0.9em;
  color: #5c6b7a;
}

.menu-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.menu-button:hover .button-icon {
  transform: scale(1.1) rotate(10deg);
}

.subject:hover { border-color: #4CAF50; }
.exam:hover { border-color: #FF9800; }
.score:hover { border-color: #2196F3; }
.group:hover { border-color: #9C27B0; }
.logout:hover { border-color: #ff6b6b; }

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

  .menu-button {
    padding: 20px 25px;
  }

  .button-icon {
    font-size: 1.8em;
  }

  .button-title {
    font-size: 1.2em;
  }

  .deco-item {
    font-size: 2em;
  }
}
</style>