<template>
  <div class="group-menu-view">
    <div class="header">
      <h1>그룹 메뉴 👥</h1>
      <p class="subtitle">그룹을 만들어보거나 참가해보세요!</p>
    </div>
    <div class="menu-container">
      <!-- 가입된 그룹 목록 섹션을 먼저 배치 -->
      <div class="joined-groups">
        <h2>내가 가입한 그룹</h2>
        <div class="groups-list">
          <div v-if="groups.length === 0" class="no-groups">
            아직 가입한 그룹이 없습니다.
          </div>
          <div 
            v-for="group in groups" 
            :key="group.id"
            class="group-item"
            @click="selectGroup(group.id)"
          >
            <div class="group-info">
              <span class="group-name">{{ group.name }}</span>
              <span class="group-role">{{ group.role === 'leader' ? '리더' : '멤버' }}</span>
            </div>
            <div class="group-stats">
              <span class="member-count">👥 {{ group.memberCount }}명</span>
              <span class="subject-count">📚 {{ group.subjectCount }}과목</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 그룹 만들기/참가 메뉴 -->
      <div class="menu-grid">
        <div class="menu-item create-group" @click="goToGroup">
          <div class="menu-icon">🎯</div>
          <h2>그룹 만들기</h2>
          <p>새로운 그룹을 만들어보세요!</p>
        </div>
        <div class="menu-item join-group" @click="goToJoinGroup">
          <div class="menu-icon">🤝</div>
          <h2>그룹 참가</h2>
          <p>기존 그룹에 참가해보세요!</p>
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
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import axiosInst from "@/axios.js";

export default {
  name: 'GroupMenu',
  data() {
    return {
      groups: []
    }
  },
  methods: {
    goToGroup() {
      this.$router.push('/group');
    },
    goToJoinGroup() {
      this.$router.push('/join-group');
    },
    goBack() {
      this.$router.push('/studentlogin');
    },
    async fetchGroups() {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const userId = userInfo?.userId;
        
        if (!userId) {
          console.error('사용자 정보를 찾을 수 없습니다.');
          return;
        }

        const response = await axiosInst.get('/groups/myGroup', {
          params: { userId }
        });

        this.groups = response.data;
        console.log('Received groups:', this.groups);

      } catch (error) {
        console.error('가입된 그룹 목록을 가져오는데 실패했습니다:', error);
      }
    },
    selectGroup(groupId) {
      // 그룹 선택 시 localStorage에 저장하고 메인 메뉴로 이동
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      userInfo.groupInfo = {
        groupId,
        isLeader: this.groups.find(g => g.groupId === groupId)?.isLeader || false
      };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      this.$router.push('/studentmenu');
    }
  },
  async created() {
    await this.fetchGroups();
  }
}
</script>

<style scoped>
.group-menu-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #fff5f5;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(255,182,193,0.3) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(255,218,185,0.3) 0%, transparent 20%);
  position: relative;
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

.menu-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
}

.joined-groups {
  background: white;
  border-radius: 30px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(255,135,135,0.15);
  width: 100%;
}

.joined-groups h2 {
  color: #ff8787;
  font-size: 2em;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
}

.groups-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.group-item {
  background: #fff5f5;
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(255,135,135,0.1);
  width: 100%;
}

.group-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(255,135,135,0.2);
  border-color: #ffd5d5;
}

.group-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.group-name {
  font-size: 1.2em;
  font-weight: 500;
  color: #2c3e50;
}

.group-role {
  background: #ff8787;
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.9em;
  box-shadow: 0 2px 5px rgba(255,135,135,0.2);
}

.group-stats {
  display: flex;
  gap: 15px;
  color: #5c6b7a;
  font-size: 0.9em;
}

.no-groups {
  text-align: center;
  color: #ff8787;
  padding: 30px;
  font-size: 1.2em;
  background: white;
  border-radius: 20px;
  margin: 20px 0;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 50px;
  width: 100%;
  padding: 0 40px;
}

.menu-item {
  background: #ff8787;
  border-radius: 30px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(255,135,135,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  height: 180px;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.menu-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(255,135,135,0.3);
  background: #ff6b6b;
}

.menu-item h2 {
  color: white;
  font-size: 1.8em;
  margin: 0;
  font-weight: bold;
}

.menu-item p {
  color: white;
  font-size: 1.1em;
  margin: 0;
  opacity: 0.9;
}

.create-group {
  background: #ff8787;
}

.join-group {
  background: #ff9b9b;
}

.menu-icon {
  font-size: 2.8em;
  margin-bottom: 5px;
  animation: bounce 2s infinite;
  color: white;
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

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
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

@media (max-width: 768px) {
  h1 {
    font-size: 2.5em;
  }

  .subtitle {
    font-size: 1.3em;
  }

  .menu-container {
    padding: 15px;
  }

  .joined-groups, .menu-grid {
    width: calc(100% - 30px);
    margin: 0 15px;
  }

  .menu-grid {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 0 20px;
  }
  
  .menu-item {
    height: 160px;
    padding: 20px;
  }

  .joined-groups h2 {
    font-size: 1.6em;
  }

  .menu-icon {
    font-size: 2.5em;
  }

  .menu-item h2 {
    font-size: 1.5em;
  }

  .menu-item p {
    font-size: 1em;
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