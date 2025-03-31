<template>
  <div class="student-menu-view">
    <div class="header">
      <h1>무엇을 해볼까요? 🤔</h1>
      <p class="subtitle">오늘도 즐거운 공부해요!</p>
      <div v-if="userInfo && userInfo.groupInfo" class="group-info">
        <span class="user-name">{{ userInfo.name }}</span>
        <span class="group-badge">{{ userInfo.groupInfo.name }}</span>
        <span class="role-badge">{{ userInfo.groupInfo.role === 'admin' ? '관리자' : '그룹원' }}</span>
      </div>
    </div>
    <div class="menu-buttons">
      <div class="menu-item" @click="goToDailyQuiz">
        <div class="menu-icon">📝</div>
        <div class="menu-text">
          <h3>문제 만들기</h3>
          <p>자유롭게 연습문제와 시험문제를 생성해요!</p>
        </div>
      </div>
      <div class="menu-item" @click="goToExam">
        <div class="menu-icon">✍️</div>
        <div class="menu-text">
          <h3>문제 풀기</h3>
          <p>연습과 실전 문제를 풀어봐요!</p>
        </div>
      </div>
      <div class="menu-item" @click="goToStudyStatus">
        <div class="menu-icon">📊</div>
        <div class="menu-text">
          <h3>학습 현황</h3>
          <p>학습 현황을 확인해보세요!</p>
        </div>
      </div>
      <div class="menu-item logout" @click="logout">
        <div class="menu-icon">👋</div>
        <div class="menu-text">
          <h3>로그아웃</h3>
          <p>다음에 또 만나요!</p>
        </div>
      </div>
    </div>
    <div class="decoration">
      <span class="deco-item pencil">✏️</span>
      <span class="deco-item book">📚</span>
      <span class="deco-item ruler">📏</span>
      <span class="deco-item backpack">🎒</span>
      <span class="deco-item apple"></span>
    </div>

    <!-- 문제 풀기 팝업 -->
    <div v-if="showProblemPopup" class="popup-overlay">
      <div class="popup-content">
        <div class="popup-header">
          <h2>문제 풀기 📝</h2>
          <button class="close-button" @click="closeProblemPopup">
            <span class="button-icon">✕</span>
          </button>
        </div>
        
        <!-- 문제 유형 선택 -->
        <div class="problem-type-selector">
          <button 
            :class="['type-btn', { active: selectedType === 'practice' }]" 
            @click="selectedType = 'practice'"
          >
            <span class="type-icon">📚</span>
            <span class="type-text">연습문제</span>
          </button>
          <button 
            :class="['type-btn', { active: selectedType === 'exam' }]" 
            @click="selectedType = 'exam'"
          >
            <span class="type-icon">✍️</span>
            <span class="type-text">시험문제</span>
          </button>
        </div>

        <div class="problem-sets-list">
          <div v-for="(set, index) in filteredProblemSets" :key="index" class="problem-set-item">
            <div class="set-info">
              <span class="set-icon">{{ set.isExam ? '✍️' : '📚' }}</span>
              <div class="set-details">
                <span class="set-name">{{ set.name }}</span>
                <span class="set-date">{{ set.createdAt }}</span>
                <div class="set-pdfs">
                  <span class="pdf-label">사용된 PDF:</span>
                  <div class="pdf-list">
                    <span v-for="(pdf, pdfIndex) in set.pdfFiles" :key="pdfIndex" class="pdf-tag">
                      {{ pdf.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button class="solve-button" @click="solveProblem(set)">
              <span class="button-icon">✏️</span>
              <span class="button-text">풀기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInst from '../axios'

export default {
  name: 'StudentMenu',
  data() {
    return {
      subjects: [],
      userInfo: null,
      showProblemPopup: false,
      selectedType: 'practice', // 'practice' 또는 'exam'
      problemSets: [
        {
          name: "수학 기초 연습",
          createdAt: "2024년 3월 15일 14:30",
          isExam: false,
          pdfFiles: [
            { name: "수학_기초.pdf", size: 1024000 },
            { name: "수학_연습.pdf", size: 2048000 }
          ]
        },
        {
          name: "영어 문법 연습",
          createdAt: "2024년 3월 14일 16:45",
          isExam: false,
          pdfFiles: [
            { name: "영어_문법.pdf", size: 1536000 }
          ]
        },
        {
          name: "중간고사 수학",
          createdAt: "2024년 3월 16일 09:00",
          isExam: true,
          pdfFiles: [
            { name: "수학_중간고사.pdf", size: 3072000 }
          ]
        },
        {
          name: "영어 시험",
          createdAt: "2024년 3월 17일 10:30",
          isExam: true,
          pdfFiles: [
            { name: "영어_시험.pdf", size: 2048000 }
          ]
        }
      ]
    }
  },
  computed: {
    filteredProblemSets() {
      return this.problemSets.filter(set => 
        this.selectedType === 'practice' ? !set.isExam : set.isExam
      );
    }
  },
  methods: {
    goToDailyQuiz() {
      this.$router.push('/problem-create');
    },
    goToExam() {
      this.showProblemPopup = true;
    },
    goToStudyStatus() {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo && userInfo.groupInfo && userInfo.groupInfo.role === 'admin') {
        this.$router.push('/managerdashboard');
      } else {
        this.$router.push('/student-dashboard');
      }
    },
    logout() {
      localStorage.removeItem('student');
      this.$router.push('/');
    },
    closeProblemPopup() {
      this.showProblemPopup = false;
    },
    solveProblem(set) {
      // 문제 풀기 페이지로 이동
      this.$router.push('/exam');
    }
  },
  async created() {
    try {
      const response = await axiosInst.get('/subjects');
      this.subjects = response.data;
    } catch (error) {
      console.error('과목 목록을 가져오는데 실패했습니다:', error);
    }

    // 로컬 스토리지에서 사용자 정보 가져오기
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      this.userInfo = JSON.parse(userInfoStr);
    }
  }
}
</script>

<style scoped>
.student-menu-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
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
  margin-bottom: 60px;
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

.menu-buttons {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 380px));
  gap: 30px 60px;
  width: 100%;
  max-width: 900px;
  position: relative;
  z-index: 1;
  padding: 0 30px;
  justify-content: center;
}

.menu-item {
  padding: 25px;
  font-size: 1em;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 15px;
  text-align: left;
  border: 2px solid transparent;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  height: 120px;
  width: 100%;
}

.menu-icon {
  font-size: 1.8em;
  transition: transform 0.3s ease;
  flex-shrink: 0;
  width: 45px;
  text-align: center;
}

.menu-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.menu-text h3 {
  font-size: 1.2em;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
  line-height: 1.2;
}

.menu-text p {
  font-size: 0.9em;
  color: #5c6b7a;
  margin: 0;
  line-height: 1.4;
}

/* 상단 두 버튼과 하단 두 버튼 사이의 간격 조정 */
.menu-item:nth-child(n+3) {
  margin-top: 30px;
}

.menu-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.menu-item:hover .menu-icon {
  transform: scale(1.1) rotate(10deg);
}

.menu-item.logout {
  background-color: #fff5f5;
  border: 2px solid #ffc9c9;
}

.menu-item.logout:hover {
  background-color: #ffe3e3;
  border-color: #ff6b6b;
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(255,107,107,0.2);
}

.menu-item.logout .menu-text h3 {
  color: #ff6b6b;
}

.menu-item.logout .menu-text p {
  color: #ff8787;
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

.group-info {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: white;
  padding: 10px 20px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(255,107,107,0.2);
}

.user-name {
  font-size: 1.2em;
  color: #ff6b6b;
  font-weight: bold;
}

.group-badge {
  background-color: #ff8787;
  color: white;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.9em;
}

.role-badge {
  background-color: #ffc9c9;
  color: #ff6b6b;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 0.9em;
  font-weight: 500;
}

@media (max-width: 768px) {
  .header {
    margin-bottom: 40px;
  }

  .menu-buttons {
    grid-template-columns: minmax(0, 400px);
    gap: 25px;
    padding: 0 20px;
  }

  .menu-item {
    height: 100px;
    padding: 20px;
  }

  .menu-icon {
    font-size: 1.6em;
    width: 35px;
  }

  .menu-text {
    gap: 4px;
  }

  .menu-text h3 {
    font-size: 1.1em;
  }

  .menu-text p {
    font-size: 0.85em;
  }

  /* 모바일에서는 margin-top 제거 */
  .menu-item:nth-child(n+3) {
    margin-top: 0;
  }

  h1 {
    font-size: 2.5em;
  }

  .subtitle {
    font-size: 1.3em;
  }

  .deco-item {
    font-size: 2em;
  }

  .group-info {
    flex-direction: column;
    gap: 10px;
    padding: 15px;
  }

  .user-name {
    font-size: 1.1em;
  }

  .group-badge, .role-badge {
    font-size: 0.8em;
    padding: 4px 12px;
  }
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
  border-radius: 25px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 30px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.popup-header h2 {
  color: #ff6b6b;
  font-size: 1.8em;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5em;
  color: #ff8787;
  cursor: pointer;
  padding: 5px;
  transition: all 0.3s ease;
}

.close-button:hover {
  color: #ff6b6b;
  transform: rotate(90deg);
}

.problem-type-selector {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  justify-content: center;
}

.type-btn {
  background-color: #f8f9fa;
  border: 2px solid #dee2e6;
  border-radius: 12px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.type-btn.active {
  background-color: #ff6b6b;
  border-color: #ff6b6b;
  color: white;
}

.type-icon {
  font-size: 1.2em;
}

.type-text {
  font-weight: 500;
}

.problem-sets-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.problem-set-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff5f5;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.problem-set-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255,107,107,0.1);
}

.set-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.set-icon {
  font-size: 1.5em;
}

.set-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.set-name {
  color: #2c3e50;
  font-weight: 500;
  font-size: 1.1em;
}

.set-date {
  color: #ff8787;
  font-size: 0.9em;
}

.set-pdfs {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.pdf-label {
  color: #ff8787;
  font-size: 0.9em;
  font-weight: 500;
}

.pdf-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.pdf-tag {
  background-color: white;
  color: #ff6b6b;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.85em;
  border: 1px solid #ffc9c9;
}

.solve-button {
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 8px 16px;
  font-size: 1em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.solve-button:hover {
  background-color: #ff5252;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .popup-content {
    width: 95%;
    padding: 20px;
  }

  .popup-header h2 {
    font-size: 1.5em;
  }

  .problem-set-item {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .set-info {
    flex-direction: column;
  }

  .solve-button {
    width: 100%;
    justify-content: center;
  }

  .problem-type-selector {
    flex-direction: column;
    gap: 10px;
  }

  .type-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>