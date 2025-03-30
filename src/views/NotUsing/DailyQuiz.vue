<template>
  <div class="daily-quiz-view">
    <div class="header">
      <h1>오늘의 퀴즈 🎯</h1>
      <p class="subtitle">매일 새로운 도전을 시작해보세요!</p>
    </div>
    
    <div class="quiz-container">
      <div class="quiz-info">
        <div class="info-card">
          <span class="info-icon">📅</span>
          <div class="info-content">
            <span class="info-title">오늘의 날짜</span>
            <span class="info-value">{{ today }}</span>
          </div>
        </div>
        <div class="info-card">
          <span class="info-icon">⭐</span>
          <div class="info-content">
            <span class="info-title">획득 가능 포인트</span>
            <span class="info-value">{{ points }}점</span>
          </div>
        </div>
      </div>

      <div class="quiz-content" v-if="!quizStarted">
        <div class="quiz-preview">
          <h2>오늘의 퀴즈</h2>
          <p class="quiz-description">{{ quizDescription }}</p>
          <button @click="startQuiz" class="start-button">
            <span class="button-text">퀴즈 시작하기</span>
            <span class="button-icon">🚀</span>
          </button>
        </div>
      </div>

      <div class="quiz-content" v-else>
        <div class="question-container">
          <div class="progress-bar">
            <div class="progress" :style="{ width: `${(currentQuestion + 1) / totalQuestions * 100}%` }"></div>
          </div>
          <div class="question-info">
            <span class="question-number">문제 {{ currentQuestion + 1 }}/{{ totalQuestions }}</span>
          </div>
          <div class="question">
            <h3>{{ currentQuestionData.question }}</h3>
            <div class="options">
              <button 
                v-for="(option, index) in currentQuestionData.options" 
                :key="index"
                @click="selectAnswer(index)"
                :class="['option-button', { selected: selectedAnswer === index }]"
              >
                {{ option }}
              </button>
            </div>
          </div>
          <div class="navigation-buttons">
            <button 
              v-if="currentQuestion > 0" 
              @click="previousQuestion" 
              class="nav-button prev"
            >
              이전
            </button>
            <button 
              v-if="currentQuestion < totalQuestions - 1" 
              @click="nextQuestion" 
              class="nav-button next"
            >
              다음
            </button>
            <button 
              v-if="currentQuestion === totalQuestions - 1" 
              @click="submitQuiz" 
              class="nav-button submit"
            >
              제출하기
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="decoration">
      <span class="deco-item star1">⭐</span>
      <span class="deco-item star2">✨</span>
      <span class="deco-item heart">💖</span>
      <span class="deco-item rainbow">🌈</span>
      <span class="deco-item magic">🪄</span>
    </div>
  </div>
</template>

<script>
import axiosInst from '../../axios'

export default {
  name: 'DailyQuiz',
  data() {
    return {
      today: new Date().toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long' 
      }),
      points: 100,
      quizStarted: false,
      currentQuestion: 0,
      totalQuestions: 5,
      selectedAnswer: null,
      answers: [],
      currentQuestionData: {
        question: '',
        options: []
      }
    }
  },
  methods: {
    async startQuiz() {
      try {
        const response = await axiosInst.get('/daily-quiz');
        this.quizStarted = true;
        this.currentQuestionData = response.data.questions[0];
      } catch (error) {
        console.error('퀴즈 데이터를 가져오는데 실패했습니다:', error);
      }
    },
    selectAnswer(index) {
      this.selectedAnswer = index;
      this.answers[this.currentQuestion] = index;
    },
    previousQuestion() {
      if (this.currentQuestion > 0) {
        this.currentQuestion--;
        this.selectedAnswer = this.answers[this.currentQuestion] ?? null;
      }
    },
    nextQuestion() {
      if (this.currentQuestion < this.totalQuestions - 1) {
        this.currentQuestion++;
        this.selectedAnswer = this.answers[this.currentQuestion] ?? null;
      }
    },
    async submitQuiz() {
      try {
        const response = await axiosInst.post('/daily-quiz/submit', {
          answers: this.answers
        });
        alert('퀴즈가 완료되었습니다!');
        this.$router.push('/studentmenu');
      } catch (error) {
        console.error('퀴즈 제출에 실패했습니다:', error);
      }
    }
  }
}
</script>

<style scoped>
.daily-quiz-view {
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

.quiz-container {
  width: 100%;
  max-width: 800px;
  position: relative;
  z-index: 1;
}

.quiz-info {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.info-card {
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.info-icon {
  font-size: 2em;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-title {
  font-size: 0.9em;
  color: #5c6b7a;
}

.info-value {
  font-size: 1.2em;
  font-weight: bold;
  color: #2c3e50;
}

.quiz-content {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.quiz-preview {
  text-align: center;
}

.quiz-preview h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.quiz-description {
  color: #5c6b7a;
  margin-bottom: 30px;
  font-size: 1.1em;
}

.start-button {
  padding: 15px 30px;
  font-size: 1.2em;
  background-color: #ff8787;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.start-button:hover {
  background-color: #ff6b6b;
  transform: translateY(-3px);
}

.progress-bar {
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  margin-bottom: 20px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #ff8787;
  transition: width 0.3s ease;
}

.question-info {
  margin-bottom: 20px;
}

.question-number {
  color: #5c6b7a;
  font-size: 1.1em;
}

.question h3 {
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 1.4em;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.option-button {
  padding: 15px 20px;
  border: 2px solid #ffc9c9;
  border-radius: 15px;
  background: white;
  color: #2c3e50;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.option-button:hover {
  border-color: #ff8787;
  background-color: #fff5f5;
}

.option-button.selected {
  background-color: #ff8787;
  color: white;
  border-color: #ff8787;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.nav-button {
  padding: 10px 20px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 1.1em;
  transition: all 0.3s ease;
}

.nav-button.prev {
  background-color: #f0f0f0;
  color: #5c6b7a;
}

.nav-button.next {
  background-color: #ff8787;
  color: white;
}

.nav-button.submit {
  background-color: #4CAF50;
  color: white;
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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

.star1 { top: 15%; left: 10%; animation-delay: 0s; }
.star2 { top: 25%; right: 15%; animation-delay: 1s; }
.heart { bottom: 20%; left: 15%; animation-delay: 2s; }
.rainbow { bottom: 30%; right: 10%; animation-delay: 1.5s; }
.magic { top: 40%; left: 50%; animation-delay: 0.5s; }

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

  .quiz-info {
    flex-direction: column;
  }

  .quiz-content {
    padding: 20px;
  }

  .question h3 {
    font-size: 1.2em;
  }

  .option-button {
    padding: 12px 15px;
    font-size: 1em;
  }

  .nav-button {
    padding: 8px 15px;
    font-size: 1em;
  }

  .deco-item {
    font-size: 2em;
  }
}
</style> 