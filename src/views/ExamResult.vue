<template>
  <div class="exam-result-view">
    <div class="result-container">
      <h1>시험 결과 📊</h1>
      
      <!-- 결과 테이블 -->
      <div class="result-table-container">
        <table class="result-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>정답 여부</th>
              <th>문제</th>
              <th>답</th>
              <th>해설</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(problem, index) in problems" :key="index">
              <td>{{ index + 1 }}</td>
              <td>
                <span :class="['result-badge', problem.isCorrect ? 'correct' : 'incorrect']">
                  {{ problem.isCorrect ? 'O' : 'X' }}
                </span>
              </td>
              <td>{{ problem.question }}</td>
              <td>{{ problem.answer }}</td>
              <td>
                <button class="explanation-btn" @click="toggleExplanation(index)">
                  <span class="button-icon">{{ problem.showExplanation ? '📖' : '📘' }}</span>
                  <span class="button-text">{{ problem.showExplanation ? '접기' : '펼쳐보기' }}</span>
                </button>
                <div v-if="problem.showExplanation" class="explanation-content">
                  {{ problem.explanation }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 메인 메뉴로 돌아가기 버튼 -->
      <div class="back-button-container">
        <button class="back-button" @click="goToMainMenu">
          <span class="button-icon">🏠</span>
          <span class="button-text">메인 메뉴로 돌아가기</span>
        </button>
      </div>

      <!-- 챗봇 버튼 (비활성화) -->
      <button class="chatbot-btn disabled" disabled>
        <span class="chatbot-icon">🤖</span>
        <span class="chatbot-text">챗봇</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExamResult',
  data() {
    return {
      problems: [
        {
          question: "1 + 1 = ?",
          answer: "2",
          isCorrect: true,
          explanation: "1과 1을 더하면 2가 됩니다.",
          showExplanation: false
        },
        {
          question: "2 x 3 = ?",
          answer: "5",
          isCorrect: false,
          explanation: "2와 3을 곱하면 6이 됩니다.",
          showExplanation: false
        },
        {
          question: "10 ÷ 2 = ?",
          answer: "5",
          isCorrect: true,
          explanation: "10을 2로 나누면 5가 됩니다.",
          showExplanation: false
        }
      ]
    }
  },
  methods: {
    toggleExplanation(index) {
      this.problems[index].showExplanation = !this.problems[index].showExplanation;
    },
    goToMainMenu() {
      this.$router.push('/studentmenu');
    }
  }
}
</script>

<style scoped>
.exam-result-view {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

.result-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2em;
}

.result-table-container {
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
  margin-bottom: 30px;
}

.result-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
}

.result-table th,
.result-table td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.result-table th {
  background-color: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
}

.result-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 0.9em;
}

.result-badge.correct {
  background-color: #e3fcef;
  color: #00b894;
}

.result-badge.incorrect {
  background-color: #ffe3e3;
  color: #ff6b6b;
}

.explanation-btn {
  background-color: #4dabf7;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.explanation-btn:hover {
  background-color: #339af0;
  transform: translateY(-2px);
}

.button-icon {
  font-size: 1.1em;
}

.chatbot-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.chatbot-btn:hover:not(.disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
}

.chatbot-btn.disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
  opacity: 0.7;
}

.chatbot-icon {
  font-size: 1.5em;
  margin-bottom: 2px;
}

.chatbot-text {
  font-size: 0.8em;
}

@media (max-width: 768px) {
  .exam-result-view {
    padding: 10px;
  }

  .result-table th,
  .result-table td {
    padding: 10px;
    font-size: 0.9em;
  }

  .chatbot-btn {
    width: 50px;
    height: 50px;
    bottom: 20px;
    right: 20px;
  }

  .chatbot-icon {
    font-size: 1.3em;
  }

  .chatbot-text {
    font-size: 0.7em;
  }

  .back-button {
    padding: 10px 20px;
    font-size: 1em;
  }
}

.explanation-content {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4dabf7;
  font-size: 0.95em;
  color: #495057;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.back-button-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.back-button {
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1.1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.back-button:hover {
  background-color: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
}

.back-button .button-icon {
  font-size: 1.2em;
}
</style> 