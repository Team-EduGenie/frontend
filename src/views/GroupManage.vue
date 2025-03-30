<template>
  <div class="group-manage-view">
    <div class="header">
      <h1>KT 그룹 👥</h1>
      <p class="subtitle">함께 공부하는 친구들</p>
    </div>

    <div class="group-info">
      <div class="member-count">
        <span class="count-icon">👥</span>
        <span class="count-text">그룹원: 3명</span>
      </div>
    </div>

    <div class="members-list">
      <div class="member-card" v-for="member in members" :key="member.id">
        <span class="member-icon">👤</span>
        <div class="member-info">
          <h3 class="member-name">{{ member.name }}</h3>
          <p class="member-role">{{ member.role }}</p>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="action-button invite" @click="showInvitePopup">
        <span class="button-icon">📨</span>
        <span class="button-text">그룹 초대</span>
      </button>
      <button class="action-button leave" @click="leaveGroup">
        <span class="button-icon">🚪</span>
        <span class="button-text">그룹 탈퇴</span>
      </button>
      <button class="action-button back" @click="goBack">
        <span class="button-icon">⬅️</span>
        <span class="button-text">뒤로 돌아가기</span>
      </button>
    </div>

    <!-- 초대 팝업 -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <h2>그룹 초대하기</h2>
        <div class="input-group">
          <input 
            type="text" 
            v-model="inviteId" 
            placeholder="초대할 친구의 아이디를 입력하세요"
            class="invite-input"
          >
        </div>
        <div class="popup-buttons">
          <button class="popup-button cancel" @click="closePopup">취소</button>
          <button class="popup-button confirm" @click="inviteToGroup">초대하기</button>
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
  name: 'GroupManage',
  data() {
    return {
      members: [
        { id: 1, name: '홍길동', role: '그룹장' },
        { id: 2, name: '김철수', role: '그룹원' },
        { id: 3, name: '이영희', role: '그룹원' }
      ],
      showPopup: false,
      inviteId: ''
    }
  },
  methods: {
    showInvitePopup() {
      this.showPopup = true;
      this.inviteId = '';
    },
    closePopup() {
      this.showPopup = false;
      this.inviteId = '';
    },
    inviteToGroup() {
      if (!this.inviteId.trim()) {
        alert('아이디를 입력해주세요.');
        return;
      }
      alert(`${this.inviteId}님을 그룹에 초대했습니다.`);
      this.closePopup();
    },
    leaveGroup() {
      if (confirm('정말로 그룹을 탈퇴하시겠습니까?')) {
        alert('그룹을 탈퇴했습니다.');
        this.$router.push('/group');
      }
    },
    goBack() {
      this.$router.push('/group');
    }
  }
}
</script>

<style scoped>
.group-manage-view {
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

.group-info {
  width: 100%;
  max-width: 500px;
  margin-bottom: 30px;
}

.member-count {
  background: white;
  padding: 15px 25px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.count-icon {
  font-size: 1.5em;
}

.count-text {
  font-size: 1.2em;
  font-weight: bold;
  color: #2c3e50;
}

.members-list {
  width: 100%;
  max-width: 500px;
  margin-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.member-card {
  background: white;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.member-icon {
  font-size: 2em;
}

.member-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.member-name {
  font-size: 1.3em;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.member-role {
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

.action-button.invite {
  background-color: #2196F3;
  color: white;
}

.action-button.leave {
  background-color: #ff6b6b;
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

.invite-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1.1em;
  outline: none;
  transition: border-color 0.3s ease;
}

.invite-input:focus {
  border-color: #2196F3;
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
  background-color: #2196F3;
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

  .member-card {
    padding: 15px;
  }

  .member-icon {
    font-size: 1.8em;
  }

  .member-name {
    font-size: 1.2em;
  }

  .member-role {
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

  .invite-input {
    font-size: 1em;
  }

  .popup-button {
    padding: 8px 20px;
    font-size: 1em;
  }
}
</style> 