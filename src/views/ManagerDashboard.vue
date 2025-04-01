<template>
  <div class="manager-dashboard">
    <h1>그룹 학습 현황 📊</h1>
    <div class="dashboard-container">
      <!-- 과목 선택 섹션 추가 -->
      <div class="subject-selector">
        <h2>과목 선택</h2>
        <div class="subject-list">
          <div 
            v-for="subject in subjects" 
            :key="subject.id"
            :class="['subject-item', { active: selectedSubject === subject.id }]"
            @click="selectSubject(subject.id)"
          >
            <span class="subject-icon">📝</span>
            <span class="subject-name">{{ subject.name }}</span>
          </div>
        </div>
      </div>

      <div class="leaderboard">
        <h2>리더보드</h2>
        <div v-if="selectedSubject" class="subject-info">
          <span class="selected-subject">{{ getSelectedSubjectName }}</span>
        </div>
        <div class="leaderboard-list">
          <div v-for="(user, index) in sortedUsers" :key="user.userId" class="leaderboard-item">
            <div class="rank">{{ index + 1 }}</div>
            <div class="user-info">
              <span class="user-name">{{ user.userName }}</span>
              <div class="score-info">
                <span class="score">{{ user.score }}점</span>
                <span class="time">{{ formatTime(user.time) }}</span>
              </div>
            </div>
          </div>
          <div v-if="sortedUsers.length === 0" class="no-data">
            아직 퀴즈를 푼 학생이 없습니다.
          </div>
        </div>
      </div>
    </div>
    <!-- 뒤로가기 버튼 추가 -->
    <div class="back-button-container">
      <button @click="goBack" class="back-button">
        <span class="back-icon">←</span>
        메인 메뉴로 돌아가기
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ManagerDashboard',
  data() {
    return {
      subjects: [],
      selectedSubject: null,
      users: []
    }
  },
  computed: {
    sortedUsers() {
      return [...this.users].sort((a, b) => b.score - a.score);
    },
    getSelectedSubjectName() {
      const subject = this.subjects.find(s => s.id === this.selectedSubject);
      return subject ? subject.name : '';
    }
  },
  methods: {
    async fetchSubjects() {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const groupId = userInfo?.groupInfo?.groupId;
        
        if (!groupId) {
          console.error('그룹 정보를 찾을 수 없습니다.');
          return;
        }

        const response = await axios.get('/subjects', {
          params: { groupId }
        });

        if (response.data.success) {
          this.subjects = response.data.subjects;
          if (this.subjects.length > 0) {
            this.selectSubject(this.subjects[0].id);
          }
        }
      } catch (error) {
        console.error('과목 목록을 가져오는데 실패했습니다:', error);
      }
    },

    async selectSubject(subjectId) {
      this.selectedSubject = subjectId;
      await this.fetchLeaderboard(subjectId);
    },

    async fetchLeaderboard(subjectId) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const groupId = userInfo?.groupInfo?.groupId;
        
        if (!groupId) {
          console.error('그룹 정보를 찾을 수 없습니다.');
          return;
        }

        const response = await axios.get('/leaderboard', {
          params: {
            groupId,
            subjectId
          }
        });

        if (response.data.success) {
          this.users = response.data.rankings;
        }
      } catch (error) {
        console.error('리더보드 데이터를 가져오는데 실패했습니다:', error);
      }
    },

    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes}분 ${seconds}초`;
    },

    goBack() {
      this.$router.push('/studentmenu');
    }
  },
  async created() {
    await this.fetchSubjects();
  }
}
</script>

<style scoped>
.manager-dashboard {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #ff6b6b;
  margin-bottom: 30px;
  font-size: 2.5em;
  text-align: center;
}

.dashboard-container {
  display: flex;
  gap: 30px;
}

.subject-selector {
  width: 300px;
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.subject-selector h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.subject-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.subject-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.subject-item:hover {
  background: #fff5f5;
  transform: translateY(-2px);
}

.subject-item.active {
  background: #ff6b6b;
  color: white;
}

.subject-icon {
  font-size: 1.2em;
}

.subject-name {
  font-size: 1.1em;
  font-weight: 500;
}

.subject-info {
  margin-bottom: 20px;
  padding: 10px;
  background: #fff5f5;
  border-radius: 8px;
}

.selected-subject {
  color: #ff6b6b;
  font-weight: 500;
  font-size: 1.1em;
}

.time {
  color: #5c6b7a;
  font-size: 0.9em;
}

.no-data {
  text-align: center;
  color: #5c6b7a;
  padding: 40px;
  font-size: 1.1em;
}

.leaderboard {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  flex: 1;
}

.leaderboard h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.8em;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #fff5f5;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.leaderboard-item:hover {
  transform: translateY(-2px);
}

.rank {
  width: 40px;
  height: 40px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2em;
  margin-right: 15px;
}

.user-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-name {
  font-size: 1.1em;
  font-weight: 500;
  color: #2c3e50;
}

.score-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.score {
  color: #ff6b6b;
  font-weight: bold;
  font-size: 1.1em;
}

@media (max-width: 768px) {
  .manager-dashboard {
    padding: 20px;
  }

  h1 {
    font-size: 2em;
  }

  .leaderboard h2 {
    font-size: 1.5em;
  }

  .leaderboard-item {
    padding: 12px;
  }

  .rank {
    width: 35px;
    height: 35px;
    font-size: 1.1em;
  }

  .user-name {
    font-size: 1em;
  }

  .score {
    font-size: 1em;
  }

  .back-button {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }

  .dashboard-container {
    flex-direction: column;
  }

  .subject-selector {
    width: 100%;
  }
}

.back-button-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: white;
  border: 2px solid #ff6b6b;
  border-radius: 25px;
  color: #ff6b6b;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #ff6b6b;
  color: white;
  transform: translateY(-2px);
}

.back-icon {
  font-size: 1.2em;
}
</style> 