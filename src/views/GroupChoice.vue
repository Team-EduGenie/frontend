<template>
  <div class="group-choice-view">
    <div class="header">
      <h1>그룹 선택 🎯</h1>
      <p class="subtitle">학습할 그룹을 선택해주세요!</p>
    </div>

    <div class="groups-list">
      <div v-for="group in groups" :key="group.groupId" class="group-item" @click="selectGroup(group)">
        <div class="group-info">
          <span class="group-icon">👥</span>
          <span class="group-name">{{ group.groupName }}</span>
        </div>
        <span class="select-icon">▶️</span>
      </div>
    </div>

    <div v-if="errorMessage" class="error-message">
      <span class="error-icon">😅</span>
      {{ errorMessage }}
    </div>

    <div class="bottom-button">
      <button @click="goBack" class="back-button">
        <span class="button-icon">⬅️</span>
        <span class="button-text">뒤로가기</span>
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'GroupChoice',
  data() {
    return {
      groups: [],
      errorMessage: '',
    }
  },
  methods: {
    async fetchUserGroups() {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.userId) {
          this.errorMessage = '사용자 정보를 찾을 수 없습니다.';
          return;
        }

        const response = await axios.get(`/users/${userInfo.userId}/groups`);
        this.groups = response.data;
      } catch (error) {
        console.error('그룹 목록을 불러오는데 실패했습니다:', error);
        this.errorMessage = '그룹 목록을 불러오는데 실패했습니다.';
      }
    },
    selectGroup(group) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        userInfo.groupInfo = {
          groupId: group.groupId,
          groupName: group.groupName
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        this.$router.push('/studentmenu');
      } catch (error) {
        console.error('그룹 선택 중 오류가 발생했습니다:', error);
        this.errorMessage = '그룹 선택 중 오류가 발생했습니다.';
      }
    },
    goBack() {
      this.$router.push('/group-menu');
    }
  },
  created() {
    this.fetchUserGroups();
  }
}
</script>

<style scoped>
.group-choice-view {
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
  cursor: pointer;
  transition: all 0.3s ease;
}

.group-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(255,107,107,0.3);
}

.group-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.group-icon {
  font-size: 1.5em;
}

.group-name {
  font-size: 1.3em;
  color: #495057;
  font-weight: 500;
}

.select-icon {
  font-size: 1.2em;
  color: #ff8787;
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

@media (max-width: 768px) {
  h1 {
    font-size: 2.5em;
  }

  .subtitle {
    font-size: 1.3em;
  }

  .group-item {
    padding: 15px;
  }

  .group-name {
    font-size: 1.2em;
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