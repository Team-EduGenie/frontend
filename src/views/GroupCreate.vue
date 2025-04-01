<template>
  <div class="group-create-view">
    <div class="header">
      <h1>그룹 만들기 👥</h1>
      <p class="subtitle">새로운 그룹을 만들어보세요!</p>
    </div>
    <div class="group-form">
      <div class="input-wrapper">
        <span class="input-icon">📝</span>
        <input 
          type="text" 
          v-model="groupName" 
          placeholder="그룹 이름을 입력해주세요" 
          class="group-input"
        >
      </div>
      <p v-if="errorMessage" class="error-message">
        <span class="error-icon">😅</span>
        {{ errorMessage }}
      </p>
      <button @click="createGroup" class="create-button">
        <span class="button-text">그룹 만들기</span>
        <span class="button-icon">✨</span>
      </button>
    </div>
    <div v-if="currentGroup" class="group-info">
      <div class="info-card">
        <h2>현재 그룹 정보</h2>
        <div class="info-item">
          <span class="info-label">그룹 이름:</span>
          <span class="info-value">{{ currentGroup.name }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">초대 코드:</span>
          <span class="info-value">{{ currentGroup.inviteCode }}</span>
        </div>
        <button @click="deleteGroup" class="delete-button">
          <span class="button-text">그룹 삭제</span>
          <span class="button-icon">🗑️</span>
        </button>
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
  name: 'GroupCreate',
  data() {
    return {
      groupName: '',
      currentGroup: null,
      errorMessage: ''
    }
  },
  methods: {
    async createGroup() {
      if (!this.groupName.trim()) {
        this.errorMessage = '그룹 이름을 입력해주세요!';
        return;
      }
      
      if (this.currentGroup) {
        this.errorMessage = '무료 버전에서는 그룹을 1개만 만들 수 있습니다.';
        return;
      }
      
      try {
        const response = await axios.post('/groups', {
          groupName: this.groupName
        });

        if (response.data) {
          this.currentGroup = {
            name: this.groupName,
            inviteCode: response.data.inviteCode
          };
          this.errorMessage = '';
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.errorMessage = error.response.data.message || '그룹 생성에 실패했습니다.';
        } else {
          this.errorMessage = '서버 오류가 발생했습니다.';
        }
      }
    },
    //future work : 그룹 삭제는 나중에 추가
    async deleteGroup() {
      if (confirm('정말로 그룹을 삭제하시겠습니까?')) {
        try {
          await axios.delete(`/group/${this.currentGroup.inviteCode}`);
          this.currentGroup = null;
          this.groupName = '';
          this.errorMessage = '';
        } catch (error) {
          this.errorMessage = '그룹 삭제에 실패했습니다.';
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
.group-create-view {
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

.group-form {
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

.group-input {
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

.group-input:focus {
  outline: none;
  border-color: #ff8787;
  box-shadow: 0 0 15px rgba(255,135,135,0.3);
}

.group-input::placeholder {
  color: #adb5bd;
  text-align: center;
}

.create-button, .delete-button {
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
  width: 100%;
}

.create-button {
  background-color: #ff8787;
  color: white;
}

.create-button:hover {
  background-color: #ff6b6b;
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255,135,135,0.5);
}

.delete-button {
  background-color: #ff6b6b;
  color: white;
  margin-top: 20px;
}

.delete-button:hover {
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

.create-button:hover .button-icon,
.delete-button:hover .button-icon {
  transform: translateX(5px) rotate(15deg);
}

.group-info {
  margin-top: 40px;
  width: 100%;
  max-width: 400px;
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
  width: 100%;
}

.error-icon {
  font-size: 1.3em;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5em;
  }

  .subtitle {
    font-size: 1.3em;
  }

  .group-input {
    font-size: 1.2em;
    padding: 15px 15px 15px 50px;
  }

  .input-icon {
    font-size: 1.3em;
  }

  .create-button, .delete-button {
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