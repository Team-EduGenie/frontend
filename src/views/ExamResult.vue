<!-- 이 페이지는 학생이 시험을 치고 난 후 결과를 보는 페이지입니다.
backend의 quizId를 기준으로 quiz-user table에서 isCorrenct를 가져오고, quiz테이블에서 problem, answer, explanation을 가져옵니다.
데이터를 가져오고 나면 문제 번호, 정답 여부, 문제, 답, 해설을 테이블로 출력합니다.
해설을 클릭하면 해설을 볼 수 있습니다. -->
<template>
  <div class="exam-result-view">
    <div class="result-container">
      <h1>시험 결과 📊</h1>
      
      <!-- 에러 메시지 -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <!-- 결과 테이블 -->
      <div v-if="problems.length > 0" class="result-table-container">
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
                  {{ problem.explanation || '해설을 불러오는 중입니다...' }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="no-results">
        결과가 없습니다.
      </div>

      <!-- 메인 메뉴로 돌아가기 버튼 -->
      <div class="back-button-container">
        <button class="back-button" @click="goToMainMenu">
          <span class="button-icon">🏠</span>
          <span class="button-text">메인 메뉴로 돌아가기</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ExamResult',
  data() {
    return {
      problems: [],
      error: null
    }
  },
  async created() {
    try {
      // 더미 데이터 설정
      this.problems = [
        {
          question: "2025년 IT 트렌드 중, 기업이 경쟁사보다 우위를 점하는 데 중요한 것은 무엇입니까?",
          answer: "신기술의 적용과 적응",
          isCorrect: true,
          explanation: "신기술의 적용과 적응은 기업에 경쟁력을 부여하고 변화하는 시장에 빠르게 적응할 수 있게 해줍니다.",
          showExplanation: false
        },
        {
          question: "KT의 AI 서비스 중 하나인 AICC는 무엇의 약자입니까?",
          answer: "AI Contact Center",
          isCorrect: false,
          explanation: "AICC는 AI Contact Center를 의미합니다.",
          showExplanation: false
        },
        {
          question: "클라우드 기술을 활용할 때의 주요 이점은 무엇입니까?",
          answer: "비용 절감 및 업무 처리 속도 향상",
          isCorrect: true,
          explanation: "클라우드 기술을 활용하면 비용을 절감하고 더 빠르고 정확한 업무 처리가 가능합니다.",
          showExplanation: false
        },
        {
          question: "2025년 가트너가 예측한 IT 트렌드 중 하나가 아닌 것은 무엇입니까?",
          answer: "블록체인 보급",
          isCorrect: false,
          explanation: "블록체인 보급은 제공된 목록에 포함되지 않은 트렌드입니다.",
          showExplanation: false
        },
        {
          question: "SI 프로젝트 이행 방법론 중 가장 중요한 원칙은 무엇입니까?",
          answer: "품질 관리",
          isCorrect: true,
          explanation: "SI 프로젝트 이행 방법론은 품질 관리를 가장 중요한 원칙으로 삼습니다.",
          showExplanation: false
        },
        {
          question: "데이터 패브릭이 IT 분야에서 중요한 이유는 무엇입니까?",
          answer: "데이터 통합과 접근성을 개선하기 때문",
          isCorrect: true,
          explanation: "데이터 패브릭은 다양한 출처의 데이터를 통합하고 이를 쉽게 접근할 수 있게 만듭니다.",
          showExplanation: false
        },
        {
          question: "인공지능과 IT의 결합을 통해 달성할 수 있는 것은 무엇입니까?",
          answer: "고객 서비스의 자동화",
          isCorrect: true,
          explanation: "인공지능과 IT의 결합은 고객 서비스를 자동화하고 본원적 경쟁력을 강화할 수 있습니다.",
          showExplanation: false
        },
        {
          question: "IT 트렌드 파악의 필요성 중, 기술적인 발전으로 인해 변화하는 것은 무엇입니까?",
          answer: "고객의 니즈",
          isCorrect: true,
          explanation: "기술적인 발전에 따라 고객의 니즈가 빠르고 다양하게 변화합니다.",
          showExplanation: false
        },
        {
          question: "KT의 Cloudwiz 서비스는 무엇과 관련이 있습니까?",
          answer: "클라우드 컴퓨팅",
          isCorrect: true,
          explanation: "Cloudwiz는 클라우드 컴퓨팅 서비스와 관련이 있습니다.",
          showExplanation: false
        },
        {
          question: "미래의 IT 트렌드를 예측하는 데 도움이 되는 현재의 기술은 무엇입니까?",
          answer: "인공지능과 가상현실",
          isCorrect: true,
          explanation: "인공지능과 가상현실은 이미 중요한 요소로 자리잡고 있으며, 미래의 트렌드를 예측하는 데 도움이 됩니다.",
          showExplanation: false
        }
      ];
    } catch (error) {
      console.error('퀴즈 결과를 가져오는데 실패했습니다:', error);
      this.error = '퀴즈 결과를 불러오는데 실패했습니다.';
    }
  },
  methods: {
    async toggleExplanation(index) {
      const problem = this.problems[index];
      problem.showExplanation = !problem.showExplanation;
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

@media (max-width: 768px) {
  .exam-result-view {
    padding: 10px;
  }

  .result-table th,
  .result-table td {
    padding: 10px;
    font-size: 0.9em;
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

.error-message {
  background-color: #ffe3e3;
  color: #ff6b6b;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-size: 1.2em;
}
</style> 