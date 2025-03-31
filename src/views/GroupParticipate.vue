<template>
  <div class="group-participate-view">
    <div class="header">
      <h1>그룹 참가 👥</h1>
      <p class="subtitle">초대 코드를 입력하여 그룹에 참가해보세요!</p>
    </div>
    <div class="input-section">
      <div class="input-wrapper">
        <span class="input-icon">🔑</span>
        <input 
          type="text" 
          v-model="inviteCode" 
          placeholder="초대 코드를 입력해주세요" 
          class="code-input"
        >
      </div>
      <button @click="checkGroup" class="check-button">
        <span class="button-text">확인</span>
        <span class="button-icon">🔍</span>
      </button>
    </div>
    <div v-if="groupInfo" class="group-info">
      <div class="info-card">
        <h2>그룹 정보</h2>
        <div class="info-item">
          <span class="info-label">그룹 이름:</span>
          <span class="info-value">{{ groupInfo.name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">초대 코드:</span>
          <span class="info-value">{{ groupInfo.inviteCode }}</span>
        </div>
        <button @click="joinGroup" class="join-button">
          <span class="button-text">참가하기</span>
          <span class="button-icon">✨</span>
        </button>
      </div>
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div class="bottom-button">
      <button @click="goBack" class="back-button">
        <span class="button-icon">⬅️</span>
        <span class="button-text">뒤로가기</span>
      </button>
    </div>
    <div class="decoration">
      <span class="deco-item pencil">✏️</span>
      <span class="deco-item book">📚</span>
      <span class="deco-item ruler">📏</span>
      <span class="deco-item backpack">🎒</span>
      <span class="deco-item apple">🍎</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupParticipate',
  data() {
    return {
      inviteCode: '',
      groupInfo: null,
      errorMessage: ''
    }
  },
  methods: {
    checkGroup() {
      if (!this.inviteCode.trim()) {
        this.errorMessage = '초대 코드를 입력해주세요!';
        this.groupInfo = null;
        return;
      }

      // 더미 데이터로 그룹 확인
      if (this.inviteCode === 'ABC123') {
        this.groupInfo = {
          name: 'KT Azure Study',
          inviteCode: 'ABC123'
        };
        this.errorMessage = '';
      } else {
        this.errorMessage = '존재하지 않는 그룹입니다!';
        this.groupInfo = null;
      }
    },
    joinGroup() {
      if (this.groupInfo) {
        alert('홍길동님이 그룹에 참가했습니다!');
        this.$router.push('/group-menu');
      }
    },
    goBack() {
      this.$router.push('/group-menu');
    }
  }
}
</script>

<style scoped>
.group-participate-view {
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

.input-section {
  display: flex;
  gap: 15px;
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 1;
  margin-bottom: 30px;
}

.input-wrapper {
  position: relative;
  flex: 1;
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

.code-input {
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

.code-input:focus {
  outline: none;
  border-color: #ff8787;
  box-shadow: 0 0 15px rgba(255,135,135,0.3);
}

.code-input::placeholder {
  color: #adb5bd;
  text-align: center;
}

.check-button, .join-button {
  padding: 20px 30px;
  font-size: 1.4em;
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
  white-space: nowrap;
}

.check-button {
  background-color: #ff8787;
  color: white;
}

.check-button:hover {
  background-color: #ff6b6b;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255,135,135,0.5);
}

.join-button {
  background-color: #ff6b6b;
  color: white;
  margin-top: 20px;
  width: 100%;
}

.join-button:hover {
  background-color: #ff5252;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255,82,82,0.5);
}

.button-text {
  font-weight: bold;
}

.button-icon {
  font-size: 1.2em;
  transition: transform 0.3s ease;
}

.check-button:hover .button-icon,
.join-button:hover .button-icon {
  transform: translateX(5px) rotate(15deg);
}

.group-info {
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 1;
}

.info-card {
  background-color: white;
  border-radius: 25px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(255,135,135,0.2);
}

.info-card h2 {
  color: #ff6b6b;
  font-size: 1.8em;
  margin-bottom: 20px;
  text-align: center;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #fff5f5;
  border-radius: 15px;
  margin-bottom: 15px;
}

.info-label {
  color: #ff8787;
  font-size: 1.2em;
  font-weight: 500;
}

.info-value {
  color: #495057;
  font-size: 1.2em;
  font-weight: bold;
}

.error-message {
  color: #ff6b6b;
  font-size: 1.2em;
  margin: 20px 0;
  text-align: center;
  position: relative;
  z-index: 1;
}

.bottom-button {
  margin-top: 40px;
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
}

.back-button {
  width: 100%;
  padding: 15px 30px;
  font-size: 1.3em;
  background-color: #fff5f5;
  color: #ff6b6b;
  border: 2px solid #ffc9c9;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(255,107,107,0.2);
}

.back-button:hover {
  background-color: #ff8787;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(255,107,107,0.3);
}

.back-button .button-icon {
  font-size: 1.2em;
}

.back-button .button-text {
  font-weight: 500;
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
.apple { top: 40%; left: 50%; animation-delay: 0.5s; }

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

  .input-section {
    flex-direction: column;
    gap: 15px;
  }

  .code-input {
    font-size: 1.2em;
    padding: 15px 15px 15px 50px;
  }

  .input-icon {
    font-size: 1.3em;
  }

  .check-button, .join-button {
    font-size: 1.3em;
    padding: 15px 25px;
  }

  .info-card {
    padding: 20px;
  }

  .info-card h2 {
    font-size: 1.5em;
  }

  .info-item {
    padding: 10px;
  }

  .info-label, .info-value {
    font-size: 1.1em;
  }

  .error-message {
    font-size: 1.1em;
  }

  .deco-item {
    font-size: 2em;
  }

  .bottom-button {
    margin-top: 30px;
    max-width: 300px;
  }

  .back-button {
    font-size: 1.2em;
    padding: 12px 25px;
  }
}
</style> 