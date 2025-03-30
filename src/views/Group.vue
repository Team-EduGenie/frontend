<template>
  <div class="group-view">
    <div class="header">
      <h1>그룹 관리 👥</h1>
      <p class="subtitle">친구들과 함께 공부해보세요!</p>
    </div>

    <div class="current-group">
      <div class="group-card" @click="goToGroupManage">
        <span class="group-icon">🏢</span>
        <div class="group-info">
          <h3 class="group-name">KT 그룹</h3>
          <p class="group-description">현재 가입된 그룹</p>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="action-button create" @click="showCreatePopup">
        <span class="button-icon">✨</span>
        <span class="button-text">그룹 만들기</span>
      </button>
      <button class="action-button back" @click="goBack">
        <span class="button-icon">⬅️</span>
        <span class="button-text">뒤로 돌아가기</span>
      </button>
    </div>

    <!-- 그룹 만들기 팝업 -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <h2>새 그룹 만들기</h2>
        <div class="input-group">
          <input 
            type="text" 
            v-model="groupName" 
            placeholder="그룹 이름을 입력하세요"
            class="group-input"
          >
        </div>
        <div class="popup-buttons">
          <button class="popup-button cancel" @click="closePopup">취소</button>
          <button class="popup-button confirm" @click="createGroup">만들기</button>
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
export default {
  name: 'Group',
  data() {
    return {
      showPopup: false,
      groupName: ''
    }
  },
  methods: {
    showCreatePopup() {
      this.showPopup = true;
      this.groupName = '';
    },
    closePopup() {
      this.showPopup = false;
      this.groupName = '';
    },
    createGroup() {
      if (!this.groupName.trim()) {
        alert('그룹 이름을 입력해주세요.');
        return;
      }
      alert(`${this.groupName} 그룹이 생성되었습니다.`);
      this.closePopup();
    },
    goBack() {
      this.$router.push('/studentmenu');
    },
    goToGroupManage() {
      this.$router.push('/group-manage');
    }
  }
}
</script>

<style scoped>
.group-view {
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

.current-group {
  width: 100%;
  max-width: 500px;
  margin-bottom: 40px;
}

.group-card {
  background: white;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.group-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.group-icon {
  font-size: 2.5em;
}

.group-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.group-name {
  font-size: 1.4em;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.group-description {
  font-size: 1.1em;
  color: #ff8787;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.action-button {
  padding: 15px 30px;
  font-size: 1.2em;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.action-button.create {
  background-color: #4CAF50;
  color: white;
}

.action-button.back {
  background-color: #6c757d;
  color: white;
}

.action-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.button-icon {
  font-size: 1.2em;
}

.button-text {
  font-weight: bold;
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

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.popup-content h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.8em;
}

.input-group {
  margin-bottom: 20px;
}

.group-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1.1em;
  outline: none;
  transition: border-color 0.3s ease;
}

.group-input:focus {
  border-color: #4CAF50;
}

.popup-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.popup-button {
  padding: 10px 25px;
  border: none;
  border-radius: 15px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.popup-button.cancel {
  background-color: #e0e0e0;
  color: #666;
}

.popup-button.confirm {
  background-color: #4CAF50;
  color: white;
}

.popup-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5em;
  }

  .subtitle {
    font-size: 1.3em;
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }

  .action-button {
    width: 100%;
    justify-content: center;
  }

  .group-card {
    padding: 15px;
  }

  .group-icon {
    font-size: 2em;
  }

  .group-name {
    font-size: 1.2em;
  }

  .group-description {
    font-size: 1em;
  }

  .deco-item {
    font-size: 2em;
  }

  .popup-content {
    padding: 20px;
    width: 95%;
  }

  .popup-content h2 {
    font-size: 1.5em;
  }

  .group-input {
    font-size: 1em;
  }

  .popup-button {
    padding: 8px 20px;
    font-size: 1em;
  }
}
</style> 