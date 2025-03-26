<template>
  <div class="custom-quiz">
    <div class="header">
      <h1>재미있는 수수께끼 시간! 🎯</h1>
      <p class="subtitle">머리를 굴려서 맞춰보아요!</p>
    </div>
    <div v-if="currentQuiz" class="quiz-content">
      <div class="question-box">
        <h2>문제 💭</h2>
        <p class="question-text">{{ currentQuiz.question }}</p>
      </div>
      <div class="answer-box">
        <div class="input-wrapper">
          <span class="input-icon">✏️</span>
          <input 
            type="text" 
            v-model="userAnswer" 
            placeholder="정답을 입력해주세요!"
            @keyup.enter="checkAnswer"
          >
        </div>
        <div class="button-wrapper">
          <button @click="checkAnswer" :disabled="isCorrect" class="check-button">
            <span class="button-icon">✨</span>
            <span class="button-text">정답 확인</span>
          </button>
          <button @click="showTrueAnswer" :disabled="showAnswer" class="show-answer-button">
            <span class="button-icon">🔍</span>
            <span class="button-text">답 보기</span>
          </button>
        </div>
      </div>
      <div v-if="showResult" class="result-message" :class="{ 'correct': isCorrect, 'incorrect': !isCorrect }">
        <span class="result-icon">{{ isCorrect ? '🎉' : '😢' }}</span>
        {{ isCorrect ? '정답입니다!' : '틀렸습니다! 정답은 ' + currentQuiz.answer + ' 입니다.' }}
      </div>
      <div v-if="showAnswer" class="answer-display">
        <p>정답은 바로... <span class="answer-text">{{ currentQuiz.answer }}</span> 이에요!</p>
      </div>
      <div class="button-group">
        <button @click="getNextQuestion" class="next-button">
          <span class="button-icon">🎲</span>
          <span class="button-text">다음 문제</span>
        </button>
        <button @click="goToMenu" class="end-button">
          <span class="button-icon">🏠</span>
          <span class="button-text">끝내기</span>
        </button>
      </div>
    </div>
    <div class="decoration">
      <span class="deco-item star1">⭐</span>
      <span class="deco-item star2">✨</span>
      <span class="deco-item heart">💖</span>
      <span class="deco-item puzzle">🧩</span>
      <span class="deco-item magic">🎨</span>
    </div>
  </div>
</template>

<script>
import axiosInst from '../axios'

export default {
  name: 'CustomQuiz',
  data() {
    return {
      currentQuiz: null,
      userAnswer: '',
      isCorrect: false,
      showResult: false,
      showAnswer: false
    }
  },
  methods: {
    async getNextQuestion() {
      try {
        console.log('문제 생성 요청 시작');
        const quizType = this.$route.query.type || 'riddle';
        const response = await axiosInst.get('/custom-quiz/generate', {
          params: { type: quizType }
        });
        console.log('문제 생성 응답:', response.data);
        this.currentQuiz = response.data;
        this.userAnswer = '';
        this.showResult = false;
        this.showAnswer = false;
        this.isCorrect = false;
      } catch (error) {
        console.error('문제 생성 실패:', error.response ? error.response.data : error.message);
        // 폴백 문제
        if (this.$route.query.type === 'cooking') {
          this.currentQuiz = {
            question: "나는 달콤하고 바삭바삭해요. 밀가루, 설탕, 버터로 만들어져요. 나는 무엇일까요?",
            answer: "쿠키"
          };
        } else {
          this.currentQuiz = {
            question: "나는 누구일까요? 나는 둥글고 노란색이며, 바나나처럼 생겼습니다.",
            answer: "바나나"
          };
        }
      }
    },
    async checkAnswer() {
      if (!this.userAnswer.trim()) return;
      
      this.isCorrect = this.userAnswer.toLowerCase() === this.currentQuiz.answer.toLowerCase();
      this.showResult = true;
      
      // 2초 후에 다음 문제로 넘어가기
      setTimeout(async () => {
        this.showResult = false;
        await this.getNextQuestion();
      }, 2000);
    },
    showTrueAnswer() {
      this.showAnswer = true;
      this.isCorrect = false;
      this.showResult = false;
    },
    goToMenu() {
      this.$router.push('/studentmenu');
    }
  },
  async created() {
    await this.getNextQuestion();
  }
}
</script>

<style scoped>
.custom-quiz {
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

.quiz-content {
  background-color: white;
  padding: 30px;
  border-radius: 25px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 600px;
  position: relative;
  z-index: 1;
}

.question-box {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff9f9;
  border-radius: 15px;
  border: 3px solid #ffd8d8;
}

.question-box h2 {
  color: #ff6b6b;
  margin-bottom: 15px;
  font-size: 1.8em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.question-text {
  font-size: 1.3em;
  color: #2c3e50;
  line-height: 1.6;
}

.answer-box {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.input-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5em;
  pointer-events: none;
}

input {
  width: 100%;
  padding: 15px 15px 15px 50px;
  font-size: 1.2em;
  border: 3px solid #ffc9c9;
  border-radius: 25px;
  background-color: white;
  color: #495057;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #ff8787;
  box-shadow: 0 0 15px rgba(255,135,135,0.3);
}

.button-wrapper {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  padding: 12px 25px;
  font-size: 1.1em;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: white;
  color: #2c3e50;
  border: 3px solid transparent;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.button-icon {
  font-size: 1.2em;
}

.check-button { background-color: #ff8787; color: white; }
.check-button:hover { background-color: #ff6b6b; transform: translateY(-3px); }

.show-answer-button { background-color: #74c0fc; color: white; }
.show-answer-button:hover { background-color: #4dabf7; transform: translateY(-3px); }

.next-button { background-color: #63e6be; color: white; }
.next-button:hover { background-color: #38d9a9; transform: translateY(-3px); }

.end-button { background-color: #ffa8a8; color: white; }
.end-button:hover { background-color: #ff8787; transform: translateY(-3px); }

.result-message {
  margin: 20px 0;
  padding: 20px;
  border-radius: 15px;
  font-size: 1.5em;
  text-align: center;
  animation: fadeInOut 2s ease-in-out;
  font-weight: bold;
}

.result-message.correct {
  background-color: #ebfbee;
  color: #40c057;
  border: 2px solid #40c057;
}

.result-message.incorrect {
  background-color: #fff5f5;
  color: #ff6b6b;
  border: 2px solid #ff6b6b;
}

.result-icon {
  font-size: 1.5em;
  margin-right: 10px;
}

.answer-display {
  margin: 20px 0;
  padding: 15px;
  background-color: #e3f2fd;
  border-radius: 15px;
  font-size: 1.2em;
  color: #1976D2;
}

.answer-text {
  font-weight: bold;
  color: #1976D2;
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
.puzzle { bottom: 30%; right: 10%; animation-delay: 1.5s; }
.magic { top: 40%; left: 50%; animation-delay: 0.5s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-20px); }
  20% { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(20px); }
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5em;
  }

  .subtitle {
    font-size: 1.3em;
  }

  .question-text {
    font-size: 1.2em;
  }

  input {
    font-size: 1.1em;
  }

  button {
    padding: 10px 20px;
    font-size: 1em;
  }

  .deco-item {
    font-size: 2em;
  }
}
</style> 