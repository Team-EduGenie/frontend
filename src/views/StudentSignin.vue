<template>
  <div class="signin-view">
    <div class="header">
      <h1>회원가입 🎉</h1>
      <p class="subtitle">새로운 친구를 모집합니다!</p>
    </div>
    <div class="signin-form">
      <div class="input-wrapper">
        <span class="input-icon">👤</span>
        <input 
          type="text" 
          v-model="userName" 
          placeholder="이름을 입력해주세요" 
          class="signin-input"
        >
      </div>
      <div class="input-wrapper">
        <span class="input-icon">🆔</span>
        <input 
          type="text" 
          v-model="userId" 
          placeholder="아이디를 입력해주세요" 
          class="signin-input"
        >
      </div>
      <div class="input-wrapper">
        <span class="input-icon">🔒</span>
        <input 
          type="password" 
          v-model="password" 
          placeholder="비밀번호를 입력해주세요" 
          class="signin-input"
        >
      </div>
      <div class="input-wrapper">
        <span class="input-icon">🔒</span>
        <input 
          type="password" 
          v-model="confirmPassword" 
          placeholder="비밀번호를 다시 입력해주세요" 
          class="signin-input"
        >
      </div>
      <div class="button-group">
        <button @click="handleSignin" class="signin-button">
          <span class="button-text">가입하기</span>
          <span class="button-icon">✨</span>
        </button>
        <button @click="goBack" class="signin-button back-button">
          <span class="button-text">이전으로</span>
          <span class="button-icon">⬅️</span>
        </button>
      </div>
      <p v-if="errorMessage" class="error-message">
        <span class="error-icon">😅</span>
        {{ errorMessage }}
      </p>
    </div>
    <div class="decoration">
      <span class="deco-item pencil">✏️</span>
      <span class="deco-item book">📚</span>
      <span class="deco-item ruler">📏</span>
      <span class="deco-item backpack">🎒</span>
    </div>
  </div>
</template>

<script>
import axiosInst from '../axios'

export default {
  name: 'StudentSignin',
  data() {
    return {
      userName: '',
      userId: '',
      password: '',
      confirmPassword: '',
      errorMessage: ''
    }
  },
  methods: {
    async handleSignin() {
      // 입력값 검증
      if (!this.userName.trim() || !this.userId.trim() || !this.password || !this.confirmPassword) {
        this.errorMessage = '모든 항목을 입력해주세요.';
        return;
      }

      if (this.password !== this.confirmPassword) {
        this.errorMessage = '비밀번호가 일치하지 않습니다.';
        return;
      }

      if (this.password.length < 6) {
        this.errorMessage = '비밀번호는 6자 이상이어야 합니다.';
        return;
      }

      try {
        const response = await axiosInst.post('/users', {
          username: this.username,
          userId: this.userId,
          password: this.password
        });

        if (response.data) {
          alert('회원가입이 완료되었습니다!');
          this.$router.push('/studentlogin');
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          this.errorMessage = '이미 사용 중인 아이디입니다.';
        } else {
          this.errorMessage = '회원가입 중 오류가 발생했습니다.';
        }
      }
    },
    goBack() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.signin-view {
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

.signin-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
  align-items: center;
}

.input-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5em;
  pointer-events: none;
}

.signin-input {
  padding: 15px 15px 15px 60px;
  font-size: 1.2em;
  border: 3px solid #ffc9c9;
  border-radius: 25px;
  width: 100%;
  background-color: white;
  transition: all 0.3s ease;
  color: #495057;
  text-align: center;
}

.signin-input:focus {
  outline: none;
  border-color: #ff8787;
  box-shadow: 0 0 15px rgba(255,135,135,0.3);
}

.signin-input::placeholder {
  color: #adb5bd;
  text-align: center;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  margin-top: 20px;
}

.signin-button {
  padding: 20px 30px;
  font-size: 1.4em;
  background-color: #ff8787;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 5px 15px rgba(255,135,135,0.4);
  text-align: center;
  width: 100%;
}

.signin-button:hover {
  background-color: #ff6b6b;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255,135,135,0.5);
}

.back-button {
  background-color: #6c757d;
  box-shadow: 0 5px 15px rgba(108,117,125,0.4);
}

.back-button:hover {
  background-color: #5a6268;
  box-shadow: 0 8px 20px rgba(108,117,125,0.5);
}

.button-text {
  font-weight: bold;
}

.button-icon {
  font-size: 1.2em;
  transition: transform 0.3s ease;
}

.signin-button:hover .button-icon {
  transform: translateX(5px) rotate(15deg);
}

.error-message {
  color: #ff6b6b;
  text-align: center;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: rgba(255,107,107,0.1);
  padding: 15px;
  border-radius: 15px;
  margin-top: 10px;
}

.error-icon {
  font-size: 1.3em;
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

.pencil { top: 15%; left: 10%; animation-delay: 0s; }
.book { top: 25%; right: 15%; animation-delay: 1s; }
.ruler { bottom: 20%; left: 15%; animation-delay: 2s; }
.backpack { bottom: 30%; right: 10%; animation-delay: 1.5s; }

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

  .signin-input {
    font-size: 1.1em;
    padding: 12px 12px 12px 50px;
  }

  .input-icon {
    font-size: 1.2em;
  }

  .signin-button {
    font-size: 1.3em;
    padding: 15px 25px;
  }

  .deco-item {
    font-size: 2em;
  }
}
</style> 