<template>
  <div class="exam-view">
    <div class="header">
      <h1>시험 📝</h1>
      <p class="subtitle">오늘의 시험을 시작해보세요!</p>
    </div>

    <div class="exam-container">
      <div class="exam-info">
        <div class="info-item">
          <span class="info-label">시험 날짜</span>
          <span class="info-value">{{ today }}</span>
        </div>
      </div>

      <div class="exam-start-section" v-if="!isStarted">
        <div class="start-content">
          <h2>시험 시작하기</h2>
          <p class="description">시험을 시작하면 타이머가 시작됩니다.<br>준비가 되면 시작 버튼을 눌러주세요.</p>
          <button class="start-button" @click="startExam">
            <span class="button-icon">▶️</span>
            <span class="button-text">시험 시작</span>
          </button>
        </div>
      </div>

      <div class="exam-progress" v-else>
        <div class="progress-header">
          <div class="timer">
            <span class="timer-icon">⏱️</span>
            <span class="timer-text">{{ formatTime }}</span>
          </div>
          <div class="question-counter">
            {{ currentQuestionIndex + 1 }} / {{ questions.length }}
          </div>
        </div>

        <div class="question-container">
          <div class="question-text">{{ currentQuestion.question }}</div>
          <div class="options">
            <button 
              v-for="(option, index) in currentQuestion.options" 
              :key="index"
              class="option-button"
              :class="{ selected: selectedAnswer === index }"
              @click="selectAnswer(index)"
            >
              {{ option }}
            </button>
          </div>
        </div>

        <div class="navigation-buttons">
          <button 
            class="nav-button prev" 
            @click="prevQuestion"
            :disabled="currentQuestionIndex === 0"
          >
            <span class="button-icon">⬅️</span>
            <span class="button-text">이전</span>
          </button>
          <button 
            class="nav-button next" 
            @click="nextQuestion"
            :disabled="currentQuestionIndex === questions.length - 1"
          >
            <span class="button-text">다음</span>
            <span class="button-icon">➡️</span>
          </button>
          <button 
            class="nav-button submit" 
            @click="submitExam"
            v-if="currentQuestionIndex === questions.length - 1"
          >
            <span class="button-icon">📤</span>
            <span class="button-text">제출하기</span>
          </button>
        </div>
      </div>
    </div>

    <div class="decoration">
      <span class="deco-item pencil">✏️</span>
      <span class="deco-item ruler">📏</span>
      <span class="deco-item book">📚</span>
      <span class="deco-item calculator">🧮</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Exam',
  data() {
    return {
      today: new Date().toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long' 
      }),
      isStarted: false,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      timeLeft: 360, // 6분
      questions: [],
      subjectId: null,
      groupId: null,
      timer: null,
      userAnswers: [] // 사용자의 답을 저장하는 배열
    }
  },
  async created() {
    // URL에서 subjectId 가져오기
    const subjectId = this.$route.query.subjectId;
    // if (!subjectId) {
    //   console.error('과목 ID가 없습니다.');
    //   this.$router.push('/studentmenu');
    //   return;
    // }
    this.subjectId = subjectId;

    // userInfo에서 groupId 가져오기
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.groupInfo || !userInfo.groupInfo.groupId) {
      console.error('그룹 정보를 찾을 수 없습니다.');
      this.$router.push('/studentmenu');
      return;
    }

    try {
      // 해당 과목의 퀴즈 문제들 가져오기
      const response = await axios.get(`/quizzes?subjectId=${this.subjectId}`);
      this.questions = response.data.map(quiz => ({
        question: quiz.question,
        options: quiz.options,
        answer: quiz.answer
      }));
    } catch (error) {
      console.error('퀴즈 문제를 가져오는데 실패했습니다:', error);
      // this.$router.push('/studentmenu');
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex]
    },
    formatTime() {
      const minutes = Math.floor(this.timeLeft / 60)
      const seconds = this.timeLeft % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  },
  methods: {
    startExam() {
      console.log('시험 시작 버튼이 클릭되었습니다.');
      this.isStarted = true;
      this.startTimer();
    },
    startTimer() {
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--
        } else {
          this.submitExam()
        }
      }, 1000)
    },
    selectAnswer(index) {
      this.selectedAnswer = index
    },
    prevQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--
        this.selectedAnswer = null
      }
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        // 현재 문제의 답을 저장
        if (this.selectedAnswer !== null) {
          this.userAnswers.push({
            quizId: this.questions[this.currentQuestionIndex].id,
            userAnswer: this.selectedAnswer
          });
        }
        this.currentQuestionIndex++
        this.selectedAnswer = null
      }
    },
    async submitExam() {
      // 마지막 문제의 답도 저장
      if (this.selectedAnswer !== null) {
        this.userAnswers.push({
          quizId: this.questions[this.currentQuestionIndex].id,
          userAnswer: this.selectedAnswer
        });
      }

      try {
        // 답안 제출
        await axios.post('/quiz/submit', {
          subjectId: this.subjectId,
          answers: this.userAnswers
        });

        // 결과 페이지로 이동
        this.$router.push({
          path: '/exam-result',
          query: {
            subjectId: this.subjectId
          }
        });
      } catch (error) {
        console.error('답안 제출에 실패했습니다:', error);
        alert('답안 제출에 실패했습니다. 다시 시도해주세요.');
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}
</script>

<style scoped>
.exam-view {
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

.exam-container {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  margin-bottom: 40px;
}

.exam-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.info-label {
  color: #6c757d;
  font-size: 0.9em;
}

.info-value {
  color: #2c3e50;
  font-size: 1.2em;
  font-weight: bold;
}

.exam-start-section {
  text-align: center;
  padding: 40px 20px;
}

.start-content {
  max-width: 500px;
  margin: 0 auto;
}

.start-content h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 2em;
}

.description {
  color: #6c757d;
  font-size: 1.2em;
  line-height: 1.6;
  margin-bottom: 30px;
}

.start-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 25px;
  font-size: 1.2em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.start-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
}

.timer {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #dc3545;
  font-size: 1.2em;
  font-weight: bold;
}

.question-counter {
  color: #6c757d;
  font-size: 1.1em;
}

.question-container {
  margin-bottom: 30px;
}

.question-text {
  font-size: 1.4em;
  color: #2c3e50;
  margin-bottom: 20px;
  line-height: 1.6;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.option-button {
  padding: 15px 20px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  background: white;
  color: #2c3e50;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.option-button:hover {
  border-color: #4CAF50;
  background-color: #f8f9fa;
}

.option-button.selected {
  border-color: #4CAF50;
  background-color: #e8f5e9;
  color: #2e7d32;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 30px;
}

.nav-button {
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

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.nav-button.prev {
  background-color: #6c757d;
  color: white;
}

.nav-button.next {
  background-color: #4CAF50;
  color: white;
}

.nav-button.submit {
  background-color: #dc3545;
  color: white;
}

.nav-button:hover:not(:disabled) {
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

.pencil { top: 15%; left: 10%; animation-delay: 0s; }
.ruler { top: 25%; right: 15%; animation-delay: 1s; }
.book { bottom: 20%; left: 15%; animation-delay: 2s; }
.calculator { bottom: 30%; right: 10%; animation-delay: 1.5s; }

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

  .exam-container {
    padding: 20px;
  }

  .question-text {
    font-size: 1.2em;
  }

  .option-button {
    padding: 12px 15px;
    font-size: 1em;
  }

  .navigation-buttons {
    flex-direction: column;
  }

  .nav-button {
    width: 100%;
    justify-content: center;
  }

  .deco-item {
    font-size: 2em;
  }
}
</style> 