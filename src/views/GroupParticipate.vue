<template>
  <div class="group-participate-view">
    <div class="header">
      <h1>그룹 참가 👥</h1>
      <p class="subtitle">참가하고 싶은 그룹을 검색해보세요!</p>
    </div>
    <div class="input-section">
      <div class="input-wrapper">
        <span class="input-icon">🔍</span>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="그룹 이름을 입력해주세요" 
          class="code-input"
        >
      </div>
      <button @click="searchGroups" class="check-button">
        <span class="button-text">검색</span>
        <span class="button-icon">🔍</span>
      </button>
    </div>

    <div v-if="groups && groups.length > 0" class="groups-list">
      <div v-for="group in groups" :key="group.groupId" class="group-item">
        <div class="group-info">
          <span class="group-name">{{ group.groupName }}</span>
        </div>
        <button @click="showInvitePopup(group)" class="join-button">
          <span class="button-text">참가하기</span>
          <span class="button-icon">✨</span>
        </button>
      </div>
    </div>

    <div v-else-if="searchQuery" class="no-results">
      <span class="error-icon">😅</span>
      검색 결과가 없습니다.
    </div>

    <div v-if="errorMessage && !searchQuery" class="error-message">
      <span class="error-icon">😅</span>
      {{ errorMessage }}
    </div>

    <!-- 초대 코드 입력 팝업 -->
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup-content">
        <h2>초대 코드 입력</h2>
        <div class="input-wrapper">
          <span class="input-icon">🔑</span>
          <input 
            type="text" 
            v-model="inviteCode" 
            placeholder="초대 코드를 입력해주세요" 
            class="code-input"
          >
        </div>
        <div class="popup-buttons">
          <button @click="closePopup" class="cancel-button">
            <span class="button-text">취소</span>
          </button>
          <button @click="joinGroup" class="confirm-button">
            <span class="button-text">확인</span>
          </button>
        </div>
      </div>
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
import axios from 'axios';

export default {
  name: 'GroupParticipate',
  data() {
    return {
      searchQuery: '',
      groups: [],
      errorMessage: '',
      showPopup: false,
      inviteCode: '',
      selectedGroup: null,
      currentGroup: null
    }
  },
  methods: {
    async searchGroups() {
      if (!this.searchQuery.trim()) {
        this.errorMessage = '그룹 이름을 입력해주세요!';
        this.groups = [];
        return;
      }

      this.groups = []; // 검색 시작할 때 groups 배열 초기화
      this.errorMessage = '';

      try {
        const response = await axios.get(`/groups/?groupName=${this.searchQuery}`);
        if (response.data && Array.isArray(response.data)) {
          this.groups = response.data;
        } else {
          this.groups = [];
          this.errorMessage = '검색 결과가 없습니다.';
        }
      } catch (error) {
        this.errorMessage = '그룹 검색에 실패했습니다.';
        this.groups = [];
      }
    },
    showInvitePopup(group) {
      this.selectedGroup = group;
      this.showPopup = true;
      this.inviteCode = '';
    },
    closePopup() {
      this.showPopup = false;
      this.inviteCode = '';
      this.selectedGroup = null;
    },
    async joinGroup() {
      if (!this.inviteCode.trim()) {
        this.errorMessage = '초대 코드를 입력해주세요!';
        return;
      }

      try {
        const response = await axios.post(`/groups/${this.selectedGroup.groupId}/members`, {
          inviteCode: this.inviteCode
        });

        if (response.data) {
          this.currentGroup = this.selectedGroup;
          this.closePopup();
          this.errorMessage = '';
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.errorMessage = '초대 코드가 일치하지 않습니다.';
        } else {
          this.errorMessage = '그룹 참가에 실패했습니다.';
        }
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

.groups-list {
  width: 100%;
  max-width: 500px;
  margin-top: 30px;
  position: relative;
  z-index: 1;
}

.group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 20px;
  border-radius: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(255,107,107,0.2);
}

.group-name {
  font-size: 1.3em;
  color: #495057;
  font-weight: 500;
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
  background-color: white;
  padding: 30px;
  border-radius: 25px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.popup-content h2 {
  color: #ff6b6b;
  font-size: 1.8em;
  margin-bottom: 20px;
  text-align: center;
}

.popup-buttons {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 20px;
}

.cancel-button, .confirm-button {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 15px;
  font-size: 1.2em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button {
  background-color: #f8f9fa;
  color: #495057;
}

.confirm-button {
  background-color: #ff8787;
  color: white;
}

.cancel-button:hover {
  background-color: #e9ecef;
}

.confirm-button:hover {
  background-color: #ff6b6b;
}

@media (max-width: 768px) {
  .group-item {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .popup-content {
    padding: 20px;
    width: 95%;
  }

  .popup-content h2 {
    font-size: 1.5em;
  }
}

.no-results {
  color: #ff8787;
  font-size: 1.2em;
  text-align: center;
  margin: 20px 0;
  position: relative;
  z-index: 1;
}
</style> 