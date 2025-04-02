<template>
  <div class="login-view">
    <div class="header">
      <h1>안녕하세요! 👋</h1>
      <p class="subtitle">아이디와 비밀번호를 입력해주세요</p>
    </div>
    <div class="login-form">
      <div class="input-wrapper">
        <span class="input-icon">👤</span>
        <input 
          type="text" 
          v-model="username" 
          placeholder="아이디를 입력해주세요" 
          class="login-input"
        >
      </div>
      <div class="input-wrapper">
        <span class="input-icon">🔒</span>
        <input 
          type="password" 
          v-model="password" 
          placeholder="비밀번호를 입력해주세요" 
          class="login-input"
          @keyup.enter="handleLogin"
        >
      </div>
      <button @click="handleLogin" class="login-button">
        <span class="button-text">로그인</span>
        <span class="button-icon">🔑</span>
      </button>
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
import axios from 'axios';

export default {
  name: 'StudentLogin',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      showError: false
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('/auth', {
          username: this.username,
          password: this.password
        });

        if (response.data) {
          // 사용자 정보를 localStorage에 저장
          localStorage.setItem('userInfo', JSON.stringify(response.data));
          // 로그인 성공 시 studentmenu로 이동
          this.$router.push('/studentmenu');
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.errorMessage = '아이디 또는 비밀번호가 일치하지 않습니다.';
        } else {
          this.errorMessage = '로그인 중 오류가 발생했습니다.';
        }
      }
    }
  }
}
</script>

<style scoped>
.login-view {
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

.login-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
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

.login-input {
  padding: 20px 20px 20px 60px;
  font-size: 1.3em;
  border: 3px solid #ffc9c9;
  border-radius: 25px;
  width: 100%;
  background-color: white;
  transition: all 0.3s ease;
  color: #495057;
  text-align: center;
}

.login-input:focus {
  outline: none;
  border-color: #ff8787;
  box-shadow: 0 0 15px rgba(255,135,135,0.3);
}

.login-input::placeholder {
  color: #adb5bd;
  text-align: center;
}

.login-button {
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

.login-button:hover {
  background-color: #ff6b6b;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255,135,135,0.5);
}

.button-text {
  font-weight: bold;
}

.button-icon {
  font-size: 1.2em;
  transition: transform 0.3s ease;
}

.login-button:hover .button-icon {
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

  .login-input {
    font-size: 1.2em;
    padding: 15px 15px 15px 50px;
  }

  .input-icon {
    font-size: 1.3em;
  }

  .login-button {
    font-size: 1.3em;
    padding: 15px 25px;
  }

  .deco-item {
    font-size: 2em;
  }
}
</style> 