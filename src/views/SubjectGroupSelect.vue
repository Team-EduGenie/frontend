<template>
  <div class="group-select-view">
    <div class="header">
      <h1>그룹 선택 👥</h1>
      <p class="subtitle">과목 퀴즈를 풀고 싶은 그룹을 선택해주세요</p>
    </div>

    <div class="group-container">
      <div class="group-card">
        <div class="group-info">
          <span class="group-icon">🎓</span>
          <div class="group-details">
            <h2>KT 그룹</h2>
            <p>멤버: 5명</p>
          </div>
        </div>
        <div class="role-buttons">
          <button v-if="isGroupLeader" class="role-button create" @click="createQuiz">
            <span class="button-icon">✏️</span>
            <span class="button-text">문제 만들기</span>
          </button>
          <button v-else class="role-button solve" @click="solveQuiz">
            <span class="button-icon">📝</span>
            <span class="button-text">문제 풀기</span>
          </button>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="action-button back" @click="goBack">
        <span class="button-icon">⬅️</span>
        <span class="button-text">뒤로 돌아가기</span>
      </button>
    </div>

    <!-- PDF 업로드 팝업 -->
    <div v-if="showUploadPopup" class="popup-overlay">
      <div class="popup-content">
        <h2>PDF 업로드</h2>
        <div class="upload-area" @click="triggerFileInput" @drop.prevent="handleDrop" @dragover.prevent>
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileSelect" 
            accept=".pdf"
            class="file-input"
            style="display: none"
          >
          <div class="upload-content">
            <span class="upload-icon">📄</span>
            <p class="upload-text">PDF 파일을 드래그하거나 클릭하여 업로드</p>
            <p class="upload-hint">지원 형식: PDF</p>
          </div>
        </div>
        <div v-if="selectedFile" class="selected-file">
          <span class="file-name">{{ selectedFile.name }}</span>
          <button class="remove-file" @click="removeFile">×</button>
        </div>
        <div class="popup-buttons">
          <button class="popup-button cancel" @click="closeUploadPopup">취소</button>
          <button class="popup-button confirm" @click="generateQuestions" :disabled="!selectedFile">
            문제 생성
          </button>
        </div>
      </div>
    </div>

    <div class="decoration">
      <span class="deco-item star">⭐</span>
      <span class="deco-item heart">💖</span>
      <span class="deco-item rainbow">🌈</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubjectGroupSelect',
  data() {
    return {
      isGroupLeader: false,
      showUploadPopup: false,
      selectedFile: null,
      // 더미 데이터
      dummyUsers: [
        {
          id: 1,
          username: 'leader',
          password: '1234',
          name: '홍길동',
          role: 'leader',
          group: 'KT 그룹'
        },
        {
          id: 2,
          username: 'member',
          password: '1234',
          name: '김철수',
          role: 'member',
          group: 'KT 그룹'
        }
      ]
    }
  },
  created() {
    // localStorage에서 현재 사용자 정보 가져오기
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      // 더미 데이터에서 현재 사용자 찾기
      const user = this.dummyUsers.find(u => u.id === currentUser.id);
      if (user) {
        this.isGroupLeader = user.role === 'leader';
      }
    }
  },
  methods: {
    goBack() {
      this.$router.push('/studentmenu');
    },
    createQuiz() {
      this.showUploadPopup = true;
    },
    closeUploadPopup() {
      this.showUploadPopup = false;
      this.selectedFile = null;
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        this.selectedFile = file;
      } else {
        alert('PDF 파일만 업로드 가능합니다.');
      }
    },
    handleDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        this.selectedFile = file;
      } else {
        alert('PDF 파일만 업로드 가능합니다.');
      }
    },
    removeFile() {
      this.selectedFile = null;
      this.$refs.fileInput.value = '';
    },
    generateQuestions() {
      if (this.selectedFile) {
        alert('문제 생성 기능은 준비 중입니다.');
        this.closeUploadPopup();
      }
    },
    solveQuiz() {
      // 이전 페이지의 경로를 확인
      const previousPath = this.$route.query.from;
      if (previousPath === 'practice') {
        this.$router.push('/quiz');
      } else {
        this.$router.push('/exam');
      }
    }
  }
}
</script>

<style scoped>
.group-select-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #f8f9fa;
  position: relative;
  overflow: hidden;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 3em;
  text-align: center;
  font-weight: bold;
}

.subtitle {
  color: #6c757d;
  font-size: 1.6em;
  margin-top: 10px;
}

.group-container {
  width: 100%;
  max-width: 600px;
  margin-bottom: 40px;
}

.group-card {
  background: white;
  padding: 25px;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 3px solid transparent;
}

.group-card:hover {
  transform: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-color: transparent;
}

.group-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.group-icon {
  font-size: 2.5em;
}

.group-details h2 {
  color: #2c3e50;
  font-size: 1.8em;
  margin-bottom: 5px;
}

.group-details p {
  color: #6c757d;
  font-size: 1.1em;
}

.role-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.role-button {
  padding: 8px 20px;
  border: none;
  border-radius: 10px;
  font-size: 1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.role-button.create {
  background-color: #4CAF50;
  color: white;
}

.role-button.solve {
  background-color: #2196F3;
  color: white;
}

.role-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.action-button {
  padding: 12px 25px;
  border: none;
  border-radius: 15px;
  font-size: 1.1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.action-button.back {
  background-color: #6c757d;
  color: white;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
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

.star { top: 15%; left: 10%; animation-delay: 0s; }
.heart { top: 25%; right: 15%; animation-delay: 1s; }
.rainbow { bottom: 20%; left: 15%; animation-delay: 2s; }

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

  .group-card {
    padding: 20px;
  }

  .group-icon {
    font-size: 2em;
  }

  .group-details h2 {
    font-size: 1.5em;
  }

  .group-details p {
    font-size: 1em;
  }

  .action-button {
    padding: 10px 20px;
    font-size: 1em;
  }

  .deco-item {
    font-size: 2em;
  }

  .role-button {
    padding: 6px 15px;
    font-size: 0.9em;
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
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.popup-content h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.8em;
}

.upload-area {
  border: 2px dashed #e0e0e0;
  border-radius: 15px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.upload-area:hover {
  border-color: #4CAF50;
  background-color: #f8f9fa;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  font-size: 3em;
}

.upload-text {
  color: #2c3e50;
  font-size: 1.2em;
  margin: 0;
}

.upload-hint {
  color: #6c757d;
  font-size: 0.9em;
  margin: 0;
}

.selected-file {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f8f9fa;
  padding: 10px 15px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.file-name {
  color: #2c3e50;
  font-size: 1em;
  word-break: break-all;
}

.remove-file {
  background: none;
  border: none;
  color: #dc3545;
  font-size: 1.5em;
  cursor: pointer;
  padding: 0 5px;
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

.popup-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.popup-button.cancel {
  background-color: #e0e0e0;
  color: #666;
}

.popup-button.confirm {
  background-color: #4CAF50;
  color: white;
}

.popup-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .popup-content {
    padding: 20px;
    width: 95%;
  }

  .popup-content h2 {
    font-size: 1.5em;
  }

  .upload-area {
    padding: 30px;
  }

  .upload-icon {
    font-size: 2.5em;
  }

  .upload-text {
    font-size: 1.1em;
  }

  .popup-button {
    padding: 8px 20px;
    font-size: 1em;
  }
}
</style> 