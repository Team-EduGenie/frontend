<template>
    <div class="quiz-view">
      <div class="quiz-container">
        <h1>🌈 재미있는 퀴즈 시간 🌈</h1>
        <div v-if="!isFinished" class="quiz-question">
          <div class="question-box">
            <div class="question-number">문제 {{ currentIndex + 1 }}/{{ quizzes.length }}</div>
            <p class="quiz-text">{{ currentQuiz.problem }}</p>
          </div>
          <div class="answer-section">
            <div class="options-wrapper">
              <label v-for="n in 5" :key="n" class="option-label">
                <input 
                  type="radio" 
                  :value="n.toString()" 
                  v-model="answer"
                  :disabled="showResult"
                  class="option-input"
                >
                <span class="option-text">{{ n }}</span>
              </label>
            </div>
            <button @click="checkAnswer" class="quiz-button" :disabled="!answer || showResult">
              <span class="button-icon">🎯</span>
              정답 확인하기
            </button>
          </div>
          
          <div v-if="showResult" class="result-message" :class="{ 'correct': isCorrect, 'incorrect': !isCorrect }">
            <div class="result-content">
              <span class="result-icon">{{ isCorrect ? '🎉' : '💫' }}</span>
              <span class="result-text">
                {{ isCorrect ? '와아! 정답이에요!' : '아쉽네요~ 정답은 ' + currentQuiz.rightAnswer + '번 이에요!' }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="quiz-result">
          <h2>퀴즈 완료!</h2>
          <div class="score-display">
            <span class="score-icon">🏆</span>
            <p class="score-text">내 점수는?</p>
            <p class="score-number">{{ score }}/{{ quizzes.length }}</p>
          </div>
          <button @click="goToSubjectMenu" class="back-button">
            <span class="button-icon">🏠</span>
            과목 선택으로 돌아가기
          </button>
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
  import axiosInst from '../axios'
  
  export default {
    name: 'Quiz',
    data() {
      return {
        quizzes: [],
        currentIndex: 0,
        answer: '',
        score: 0,
        isFinished: false,
        error: null,
        showResult: false,
        isCorrect: false
      }
    },
    computed: {
      currentQuiz() {
        return this.quizzes[this.currentIndex] || {};
      }
    },
    methods: {
      goToSubjectMenu() {
        this.$router.push('/studentmenu');
      },
      async checkAnswer() {
        if (!this.answer) return;
        
        const studentData = JSON.parse(localStorage.getItem('student'));
        this.isCorrect = this.answer === this.currentQuiz.rightAnswer;
        this.showResult = true;
        
        if (this.isCorrect) {
          try {
            await axiosInst.post('/student-diff/increment-score', {
              studentId: studentData.studentId,
              unitId: this.$route.query.unitId
            });
            this.score++;
          } catch (error) {
            console.error('점수 업데이트 실패:', error);
          }
        }
  
        // 3초 후에 다음 문제로 넘어가기
        setTimeout(async () => {
          this.showResult = false;
          this.answer = '';
          
          if (this.currentIndex < this.quizzes.length - 1) {
            this.currentIndex++;
          } else {
            this.isFinished = true;
            try {
              // 최종 점수 조회
              const response = await axiosInst.get('/student-diff/score', {
                params: {
                  studentId: studentData.studentId,
                  unitId: this.$route.query.unitId
                }
              });
              this.score = response.data.score;
  
              // 난이도 업데이트
              await axiosInst.post('/quizzes/submit', {
                studentId: studentData.studentId,
                unitId: this.$route.query.unitId,
                totalQuestions: this.quizzes.length,
                correctAnswers: this.score
              });
            } catch (error) {
              console.error('최종 점수 조회 실패:', error);
            }
          }
        }, 3000);
      }
    },
    async created() {
      try {
        const unitId = this.$route.query.unitId;
        const studentData = JSON.parse(localStorage.getItem('student'));
        
        if (!studentData || !studentData.studentId) {
          console.error('학생 정보를 찾을 수 없습니다.');
          this.error = '학생 정보를 찾을 수 없습니다.';
          return;
        }

        console.log('학생 ID:', studentData.studentId);
        console.log('단원 ID:', unitId);
        
        // 현재 난이도 가져오기
        try {
          const diffResponse = await axiosInst.get('/student-diff/score', {
            params: {
              studentId: studentData.studentId,
              unitId: unitId
            }
          });
        } catch (error) {
          console.error('난이도 조회 실패:', error);
        }
        
        // 점수 초기화
        try {
          await axiosInst.post('/student-diff/reset-score', {
            studentId: studentData.studentId,
            unitId: unitId
          });
          console.log('점수 초기화 완료');
        } catch (resetError) {
          console.error('점수 초기화 실패:', resetError);
        }

        // 현재 난이도에 맞는 퀴즈 가져오기
        const response = await axiosInst.get('/quizzes', {
          params: {
            studentId: studentData.studentId,
            unitId: unitId
          }
        });
        
        console.log('퀴즈 응답:', response.data);
        
        if (Array.isArray(response.data)) {
          this.quizzes = response.data;
          console.log('로드된 퀴즈:', this.quizzes);
          console.log('첫 번째 퀴즈 상세 정보:', this.quizzes[0]);
        } else {
          throw new Error('퀴즈 데이터 형식이 올바르지 않습니다.');
        }
      } catch (error) {
        console.error('퀴즈 초기화에 실패했습니다:', error);
        this.error = '퀴즈를 불러오는데 실패했습니다. 다시 시도해주세요.';
      }
    }
  }
  </script>
  
  <style scoped>
  .quiz-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #fff5f7;
    background-image: 
      radial-gradient(circle at 10% 20%, rgba(255,182,193,0.3) 0%, transparent 20%),
      radial-gradient(circle at 90% 80%, rgba(255,218,185,0.3) 0%, transparent 20%);
    position: relative;
    overflow: hidden;
  }

  .quiz-container {
    background-color: white;
    border-radius: 30px;
    padding: 40px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    width: 90%;
    max-width: 800px;
    margin: 20px auto;
    position: relative;
    z-index: 1;
  }

  h1 {
    color: #ff6b6b;
    margin-bottom: 30px;
    font-size: 2.5em;
    text-align: center;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(255,107,107,0.2);
  }

  .question-box {
    background-color: #fff9f9;
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
    border: 3px solid #ffd8d8;
  }

  .question-number {
    font-size: 1.2em;
    color: #ff8787;
    margin-bottom: 15px;
    text-align: center;
    font-weight: bold;
  }

  .quiz-text {
    font-size: 1.6em;
    line-height: 1.6;
    color: #495057;
    text-align: center;
    margin: 20px 0;
  }

  .answer-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .options-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .option-label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border: 3px solid #ffc9c9;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: white;
    position: relative;
  }

  .option-label:hover {
    transform: translateY(-3px);
    border-color: #ff8787;
    box-shadow: 0 5px 15px rgba(255,135,135,0.3);
  }

  .option-input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  .option-text {
    color: #ff8787;
    font-size: 1.5em;
    font-weight: bold;
    transition: all 0.3s ease;
  }

  .option-input:checked + .option-text {
    color: white;
  }

  .option-input:checked ~ .option-text {
    color: white;
  }

  .option-label:has(.option-input:checked) {
    background-color: #ff8787;
    border-color: #ff8787;
  }

  .option-label:has(.option-input:disabled) {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .quiz-button {
    padding: 15px 30px;
    font-size: 1.3em;
    background-color: #ff8787;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .quiz-button:hover:not(:disabled) {
    background-color: #ff6b6b;
    transform: translateY(-3px);
  }

  .quiz-button:disabled {
    background-color: #ffc9c9;
    cursor: not-allowed;
  }

  .button-icon {
    font-size: 1.2em;
  }

  .result-message {
    margin: 20px 0;
    padding: 20px;
    border-radius: 20px;
    font-size: 1.5em;
    text-align: center;
    animation: bounceIn 0.5s ease-out;
  }

  .result-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }

  .result-message.correct {
    background-color: #ebfbee;
    color: #40c057;
    border: 3px solid #40c057;
  }

  .result-message.incorrect {
    background-color: #fff5f5;
    color: #ff6b6b;
    border: 3px solid #ff6b6b;
  }

  .result-icon {
    font-size: 2em;
  }

  .quiz-result {
    text-align: center;
  }

  .score-display {
    background-color: #fff9f9;
    border-radius: 20px;
    padding: 30px;
    margin: 30px 0;
    border: 3px solid #ffd8d8;
  }

  .score-icon {
    font-size: 3em;
    margin-bottom: 10px;
    display: block;
  }

  .score-text {
    color: #ff8787;
    font-size: 1.5em;
    margin: 10px 0;
  }

  .score-number {
    color: #ff6b6b;
    font-size: 3em;
    font-weight: bold;
    margin: 10px 0;
  }

  .back-button {
    margin-top: 20px;
    padding: 15px 30px;
    font-size: 1.3em;
    background-color: #74c0fc;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .back-button:hover {
    background-color: #4dabf7;
    transform: translateY(-3px);
  }

  .decoration {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .deco-item {
    position: absolute;
    font-size: 2em;
    animation: float 6s ease-in-out infinite;
  }

  .star1 { top: 10%; left: 5%; animation-delay: 0s; }
  .star2 { top: 20%; right: 10%; animation-delay: 1s; }
  .heart { bottom: 15%; left: 8%; animation-delay: 2s; }
  .rainbow { bottom: 20%; right: 8%; animation-delay: 3s; }
  .magic { top: 50%; right: 5%; animation-delay: 4s; }

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
  }

  @keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); opacity: 1; }
  }
  </style>