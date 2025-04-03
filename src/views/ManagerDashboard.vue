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
      subjects: [
        { id: 1, name: 'tech new-learn - IT 트렌드' },
        { id: 2, name: 'tech new-learn - IT핵심기술' },
        { id: 3, name: 'kt azure study' },
        { id: 4, name: 'leash반 pcce java study' }
      ],
      selectedSubject: null,
      users: [],
      leaderboardData: {
        1: [ // IT 트렌드
          { userId: 1, userName: '김문찬', score: 9, time: 320 },
          { userId: 2, userName: '이현종', score: 8, time: 280 },
          { userId: 3, userName: '이소민', score: 9, time: 310 },
          { userId: 4, userName: '동세영', score: 8, time: 290 }
        ],
        2: [ // IT핵심기술
          { userId: 1, userName: '김문찬', score: 9, time: 300 },
          { userId: 2, userName: '이현종', score: 9, time: 290 },
          { userId: 3, userName: '이소민', score: 8, time: 310 },
          { userId: 4, userName: '동세영', score: 9, time: 280 }
        ],
        3: [ // kt azure study
          { userId: 1, userName: '김문찬', score: 8, time: 310 },
          { userId: 2, userName: '이현종', score: 9, time: 290 },
          { userId: 3, userName: '이소민', score: 9, time: 300 },
          { userId: 4, userName: '동세영', score: 8, time: 320 }
        ],
        4: [ // leash반 pcce java study
          { userId: 1, userName: '김문찬', score: 9, time: 290 },
          { userId: 2, userName: '이현종', score: 8, time: 310 },
          { userId: 3, userName: '이소민', score: 9, time: 300 },
          { userId: 4, userName: '동세영', score: 9, time: 280 }
        ]
      }
    }
  },
  computed: {
    sortedUsers() {
      return [...this.users].sort((a, b) => {
        if (b.score === a.score) {
          return a.time - b.time; // 점수가 같으면 시간이 적은 순으로 정렬
        }
        return b.score - a.score; // 기본적으로는 점수 높은 순으로 정렬
      });
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
      this.users = this.leaderboardData[subjectId] || [];
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
    // 초기 과목 선택 시 리더보드 데이터를 비워둠
    this.selectedSubject = null;
    this.users = [];
    await this.fetchSubjects();
  }
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

.manager-dashboard {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe4e4 100%);
  font-family: 'Pretendard', sans-serif;
}

h1 {
  color: #ff6b6b;
  margin-bottom: 40px;
  font-size: 2.5em;
  text-align: center;
  position: relative;
  padding-bottom: 15px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

h1::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #ff6b6b, #ff8e8e);
  border-radius: 2px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5em;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.dashboard-container {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.subject-selector {
  width: 300px;
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.1);
  height: fit-content;
  position: sticky;
  top: 20px;
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
  background: #fff5f5;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #ff8e8e;
}

.subject-item:hover {
  background: #ffe4e4;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.1);
}

.subject-item.active {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  border: none;
}

.subject-icon {
  font-size: 1.2em;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px;
  border-radius: 8px;
}

.subject-name {
  font-size: 1.1em;
  font-weight: 500;
  letter-spacing: -0.2px;
}

.leaderboard {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.1);
  flex: 1;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff5f5;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid #ff8e8e;
}

.leaderboard-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 107, 107, 0.1);
}

.rank {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2em;
  margin-right: 20px;
  box-shadow: 0 4px 10px rgba(255, 107, 107, 0.2);
}

.user-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-name {
  font-size: 1.1em;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: -0.2px;
}

.score-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.score {
  color: #ff6b6b;
  font-weight: 700;
  font-size: 1.2em;
  background: rgba(255, 107, 107, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  letter-spacing: -0.2px;
}

.time {
  color: #ff6b6b;
  font-size: 0.9em;
  background: rgba(255, 107, 107, 0.1);
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: 500;
  letter-spacing: -0.2px;
}

.no-data {
  text-align: center;
  color: #ff6b6b;
  padding: 40px;
  font-size: 1.1em;
  background: #fff5f5;
  border-radius: 12px;
  border: 1px dashed #ff8e8e;
  font-weight: 500;
  letter-spacing: -0.2px;
}

.back-button-container {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 30px;
  background: white;
  border: 2px solid #ff6b6b;
  border-radius: 30px;
  color: #ff6b6b;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.1);
  letter-spacing: -0.2px;
}

.back-button:hover {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.2);
}

.back-icon {
  font-size: 1.2em;
}

.subject-info {
  margin-bottom: 25px;
  padding: 15px;
  background: linear-gradient(135deg, #fff5f5, #ffe4e4);
  border-radius: 12px;
  border: 2px solid #ff8e8e;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.1);
}

.selected-subject {
  color: #ff6b6b;
  font-weight: 700;
  font-size: 1.3em;
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.selected-subject::before {
  content: '📚';
  font-size: 1.2em;
}

@media (max-width: 768px) {
  .manager-dashboard {
    padding: 20px;
  }

  h1 {
    font-size: 2em;
  }

  .dashboard-container {
    flex-direction: column;
  }

  .subject-selector {
    width: 100%;
    position: static;
  }

  .leaderboard {
    padding: 20px;
  }

  .leaderboard h2 {
    font-size: 1.5em;
  }

  .leaderboard-item {
    padding: 15px;
  }

  .rank {
    width: 35px;
    height: 35px;
    font-size: 1.1em;
    margin-right: 15px;
  }

  .user-name {
    font-size: 1em;
  }

  .score, .time {
    font-size: 0.9em;
    padding: 6px 12px;
  }

  .back-button {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}
</style> 