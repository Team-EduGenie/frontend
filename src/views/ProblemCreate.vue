<template>
  <div class="problem-create-view">
    <div class="header">
      <h1>문제 만들기 📝</h1>
      <p class="subtitle">PDF 파일을 업로드하여 문제를 만들어보세요!</p>
    </div>

    <!-- PDF 업로드 섹션 -->
    <div class="upload-section">
      <div class="upload-area" 
           @click="triggerFileInput"
           @dragover.prevent
           @drop.prevent="handleDrop"
           :class="{ 'dragging': isDragging }">
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
          <h2>PDF 파일을 업로드하세요</h2>
          <p>또는 파일을 여기에 끌어다 놓으세요</p>
        </div>
      </div>
      <div v-if="selectedFile" class="file-info">
        <div class="file-details">
          <span class="file-icon">📄</span>
          <div class="file-text">
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">{{ formatFileSize(selectedFile.size) }}</span>
          </div>
        </div>
        <button @click="uploadFile" class="upload-button">
          <span class="button-icon">⬆️</span>
          <span class="button-text">업로드</span>
        </button>
      </div>
    </div>

    <!-- 하단 섹션 -->
    <div class="bottom-section">
      <h2>문제 만들기</h2>
      <div class="content-container">
        <div class="left-section">
          <h3>PDF 목록</h3>
          <div class="pdf-list">
            <div v-for="(file, index) in uploadedFiles" :key="index" class="pdf-item">
              <input type="checkbox" v-model="file.selected" :id="'pdf-' + index">
              <label :for="'pdf-' + index">{{ file.name }}</label>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
            </div>
          </div>
        </div>
        <div class="right-section">
          <h3>문제 정보</h3>
          <div class="problem-info">
            <div class="input-group">
              <label for="problemName">문제 이름</label>
              <input type="text" id="problemName" v-model="problemName" placeholder="문제 이름을 입력하세요">
            </div>
            <button class="create-button" @click="createProblem">
              <span class="button-icon">✨</span>
              <span class="button-text">문제 만들기</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 생성된 문제 목록 섹션 -->
    <div class="bottom-section">
      <h2>생성된 문제 목록</h2>
      <div class="content-container">
        <div class="problem-sets-list">
          <div v-for="(set, index) in problemSets" :key="index" class="problem-set-item">
            <div class="set-header">
              <div class="set-info">
                <span class="set-icon">{{ set.type === 'exam' ? '✍️' : '📚' }}</span>
                <div class="set-details">
                  <span class="set-name">{{ set.name }}</span>
                  <span class="set-date">{{ set.createdAt }}</span>
                </div>
              </div>
              <div class="set-type" :class="set.type">
                {{ set.type === 'exam' ? '시험문제' : '연습문제' }}
              </div>
            </div>
            <div class="set-content">
              <div class="set-pdfs">
                <div class="pdf-list">
                  <span v-for="(pdf, pdfIndex) in set.pdfFiles" :key="pdfIndex" class="pdf-tag">
                    {{ pdf.name }}
                  </span>
                </div>
              </div>
              <button class="action-button delete" @click="deleteProblemSet(index)">
                <span class="button-icon">🗑️</span>
              </button>
            </div>
          </div>
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
export default {
  name: 'ProblemCreate',
  data() {
    return {
      selectedFile: null,
      isDragging: false,
      uploadedFiles: [], // 업로드된 PDF 파일 목록
      problemName: '', // 문제 이름
      isLeader: false, // 그룹장 여부
      problemSets: [], // 생성된 문제 세트 목록
    }
  },
  computed: {
    canCreateProblem() {
      return this.problemName.trim() !== '' && 
             this.uploadedFiles.some(file => file.selected);
    }
  },
  methods: {
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
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        this.selectedFile = file;
      } else {
        alert('PDF 파일만 업로드 가능합니다.');
      }
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    uploadFile() {
      if (!this.selectedFile) return;
      
      // 파일을 uploadedFiles 배열에 추가
      this.uploadedFiles.push({
        name: this.selectedFile.name,
        size: this.selectedFile.size,
        selected: false
      });
      
      // 임시로 성공 메시지 표시
      alert('파일이 성공적으로 업로드되었습니다!');
      this.selectedFile = null;
    },
    createProblem() {
      if (!this.problemName) {
        alert('문제 이름을 입력해주세요.');
        return;
      }

      const selectedFiles = this.uploadedFiles.filter(file => file.selected);
      if (selectedFiles.length === 0) {
        alert('최소 하나의 PDF 파일을 선택해주세요.');
        return;
      }

      // 문제 생성 로직
      const problem = {
        name: this.problemName,
        type: this.isLeader ? 'exam' : 'practice',
        pdfFiles: selectedFiles,
        createdAt: new Date().toLocaleString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      // 문제 세트 목록에 추가
      this.problemSets.push(problem);
      alert('문제가 생성되었습니다!');
      
      // 문제 생성 후 폼 초기화
      this.problemName = '';
      this.uploadedFiles = [];
    },
    viewProblemSet(set) {
      // 문제 세트 상세 보기 로직 구현
      console.log('문제 세트 보기:', set);
    },
    deleteProblemSet(index) {
      if (confirm('이 문제 세트를 삭제하시겠습니까?')) {
        this.problemSets.splice(index, 1);
      }
    },
    goBack() {
      this.$router.push('/studentmenu');
    }
  },
  created() {
    // 로컬 스토리지에서 사용자 정보 가져오기
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);
      this.isLeader = userInfo.groupInfo?.role === 'admin';
    }
  }
}
</script>

<style scoped>
.problem-create-view {
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

.upload-section {
  width: 100%;
  max-width: 600px;
  position: relative;
  z-index: 1;
}

.upload-area {
  background-color: white;
  border: 3px dashed #ffc9c9;
  border-radius: 25px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.upload-area:hover, .upload-area.dragging {
  border-color: #ff8787;
  background-color: #fff5f5;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  font-size: 2.5em;
}

.upload-content h2 {
  color: #ff6b6b;
  font-size: 1.3em;
  margin: 0;
}

.upload-content p {
  color: #ff8787;
  font-size: 1em;
  margin: 0;
}

.file-info {
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(255,107,107,0.1);
  transition: all 0.3s ease;
  border: 2px solid #ffc9c9;
}

.file-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255,107,107,0.2);
  border-color: #ff8787;
}

.file-details {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.file-icon {
  font-size: 2em;
  color: #ff6b6b;
}

.file-text {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
}

.file-name {
  color: #2c3e50;
  font-weight: 500;
  font-size: 1.1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  color: #ff8787;
  font-size: 0.9em;
  background-color: #fff5f5;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
}

.upload-button {
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 15px;
  padding: 10px 20px;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 15px;
}

.upload-button:hover {
  background-color: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255,107,107,0.3);
}

.button-icon {
  font-size: 1.2em;
}

.bottom-section {
  width: 100%;
  max-width: 1200px;
  margin-top: 40px;
  background-color: white;
  border-radius: 25px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(255,107,107,0.1);
  position: relative;
  z-index: 1;
}

.bottom-section h2 {
  color: #ff6b6b;
  font-size: 2em;
  margin-bottom: 30px;
  text-align: center;
}

.content-container {
  display: flex;
  gap: 30px;
}

.left-section,
.right-section {
  flex: 1;
  padding: 20px;
  background-color: #fff5f5;
  border-radius: 20px;
}

.left-section h3,
.right-section h3 {
  color: #ff6b6b;
  font-size: 1.4em;
  margin-bottom: 20px;
  text-align: center;
}

.pdf-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  background-color: white;
  border-radius: 15px;
}

.pdf-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background-color: white;
  border-radius: 12px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  border: 1px solid #ffc9c9;
}

.pdf-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255,107,107,0.1);
  border-color: #ff8787;
}

.pdf-item:last-child {
  margin-bottom: 0;
}

.pdf-item input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 22px;
  height: 22px;
  border: 2px solid #ffc9c9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.pdf-item input[type="checkbox"]:checked {
  background-color: #ff6b6b;
  border-color: #ff6b6b;
}

.pdf-item input[type="checkbox"]:checked::after {
  content: '✓';
  color: white;
  font-size: 14px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.pdf-item input[type="checkbox"]:hover {
  border-color: #ff8787;
}

.pdf-item label {
  flex: 1;
  color: #2c3e50;
  font-weight: 500;
  font-size: 1.1em;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pdf-item .file-size {
  color: #ff8787;
  font-size: 0.9em;
  background-color: #fff5f5;
  padding: 4px 12px;
  border-radius: 20px;
  white-space: nowrap;
}

.problem-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.input-group label {
  color: #2c3e50;
  font-weight: 500;
  font-size: 1.1em;
}

#problemName {
  width: 100%;
  padding: 12px 20px;
  border: 2px solid #ffc9c9;
  border-radius: 15px;
  font-size: 1.1em;
  transition: all 0.3s ease;
  background-color: white;
  color: #2c3e50;
}

#problemName:focus {
  outline: none;
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255,107,107,0.1);
  transform: translateY(-1px);
}

#problemName::placeholder {
  color: #ffc9c9;
}

.problem-type-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background-color: #fff5f5;
  border-radius: 12px;
  margin: 10px 0;
}

.type-icon {
  font-size: 1.2em;
}

.type-text {
  color: #ff6b6b;
  font-weight: 500;
}

.create-button {
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 15px;
  padding: 15px 30px;
  font-size: 1.2em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.create-button:hover:not(:disabled) {
  background-color: #ff5252;
  transform: translateY(-2px);
}

.create-button:disabled {
  background-color: #ffc9c9;
  cursor: not-allowed;
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

.problem-sets-list {
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  padding: 20px;
  background-color: #fff5f5;
  border-radius: 20px;
}

.problem-set-item {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: white;
  border-radius: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(255,107,107,0.1);
  transition: all 0.3s ease;
  gap: 15px;
}

.problem-set-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255,107,107,0.2);
}

.set-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.set-type {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: 500;
}

.set-type.exam {
  background-color: #ffd8d8;
  color: #ff5252;
}

.set-type.practice {
  background-color: #d8f5ff;
  color: #0099cc;
}

.set-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.set-pdfs {
  flex: 1;
}

.pdf-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pdf-tag {
  background-color: #f8f9fa;
  color: #495057;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  border: 1px solid #dee2e6;
}

.action-button.delete {
  padding: 8px;
  margin-left: 10px;
  color: #ff6b6b;
  background-color: #fff5f5;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-button.delete:hover {
  background-color: #ffe3e3;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5em;
  }

  .subtitle {
    font-size: 1.3em;
  }

  .upload-area {
    padding: 20px;
  }

  .upload-icon {
    font-size: 2em;
  }

  .upload-content h2 {
    font-size: 1.2em;
  }

  .upload-content p {
    font-size: 0.9em;
  }

  .file-info {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    padding: 15px;
  }

  .file-details {
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .file-text {
    width: 100%;
  }

  .file-name {
    font-size: 1em;
  }

  .upload-button {
    width: 100%;
    justify-content: center;
    margin-left: 0;
    margin-top: 10px;
  }

  #problemName {
    font-size: 1em;
    padding: 10px 15px;
  }

  .content-container {
    flex-direction: column;
  }

  .left-section,
  .right-section {
    width: 100%;
  }

  .bottom-section h2 {
    font-size: 1.8em;
    margin-bottom: 20px;
  }

  .left-section h3,
  .right-section h3 {
    font-size: 1.2em;
    margin-bottom: 15px;
  }

  .create-button {
    padding: 12px 25px;
    font-size: 1.1em;
  }

  .back-button {
    font-size: 1.2em;
    padding: 12px 25px;
  }

  .deco-item {
    font-size: 2em;
  }

  .problem-sets-list {
    padding: 15px;
  }

  .problem-set-item {
    padding: 15px;
  }

  .set-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .set-type {
    font-size: 0.8em;
    padding: 4px 10px;
  }

  .set-name {
    font-size: 1em;
  }

  .set-date {
    font-size: 0.85em;
  }

  .pdf-tag {
    font-size: 0.8em;
    padding: 3px 10px;
  }

  .pdf-list {
    padding: 8px;
  }

  .pdf-item {
    padding: 12px;
    gap: 12px;
  }

  .pdf-item input[type="checkbox"] {
    width: 20px;
    height: 20px;
  }

  .pdf-item input[type="checkbox"]:checked::after {
    font-size: 12px;
  }

  .pdf-item label {
    font-size: 1em;
  }

  .pdf-item .file-size {
    font-size: 0.85em;
    padding: 3px 10px;
  }
}
</style> 