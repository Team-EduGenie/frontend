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
    // 테스트용 더미 데이터
    this.problems = [
      {
        question: "AI 거버넌스 플랫폼이 제공하는 '투명성 및 설명 가능성' 기능은 사용자가 AI의 판단 근거를 이해할 수 있도록 합니다. 이 기능을 강화하기 위 해 AI 개발자들이 집중해야 할 요소는 무엇일까요?",
        answer: "알고리즘 최적화",
        isCorrect: true,
        explanation: "AI의 투명성과 설명 가능성을 높이기 위해서는 알고리즘의 동작 원리와 의사결정 과정을 명확하게 설명할 수 있어야 합니다. 이를 위해 알고리즘의 최적화와 함께 의사결정 로직의 개선이 필요합니다.",
        showExplanation: false
      },
      {
        question: "AI 시스템의 윤리적 사용을 보장하기 위한 가장 중요한 원칙은 무엇일까요?",
        answer: "공정성",
        isCorrect: false,
        explanation: "AI 시스템의 윤리적 사용을 위해서는 공정성, 투명성, 책임성, 프라이버시 보호 등 여러 원칙이 중요합니다. 특히 공정성은 AI가 모든 사용자에게 동등한 기회를 제공하고 편견 없이 작동해야 함을 의미합니다.",
        showExplanation: false
      },
      {
        question: "AI 모델의 성능을 평가할 때 가장 중요한 지표는 무엇일까요?",
        answer: "정확도",
        isCorrect: true,
        explanation: "AI 모델의 성능을 평가할 때는 정확도, 정밀도, 재현율, F1 점수 등 여러 지표를 종합적으로 고려해야 합니다. 특히 정확도는 전체 예측 중 올바른 예측의 비율을 나타내는 중요한 지표입니다.",
        showExplanation: false
      },
      {
        question: "머신러닝 모델의 과적합(Overfitting)을 방지하기 위한 방법은?",
        answer: "데이터 증강",
        isCorrect: false,
        explanation: "과적합을 방지하기 위해서는 데이터 증강, 정규화, 드롭아웃, 조기 종료 등 다양한 방법을 사용할 수 있습니다. 특히 데이터 증강은 학습 데이터의 다양성을 높여 모델의 일반화 성능을 향상시킵니다.",
        showExplanation: false
      },
      {
        question: "딥러닝에서 사용되는 활성화 함수의 역할은?",
        answer: "비선형성 도입",
        isCorrect: true,
        explanation: "활성화 함수는 신경망에 비선형성을 도입하여 복잡한 패턴을 학습할 수 있게 합니다. 대표적인 활성화 함수로는 ReLU, Sigmoid, Tanh 등이 있습니다.",
        showExplanation: false
      },
      {
        question: "AI 시스템의 보안을 강화하기 위한 가장 효과적인 방법은?",
        answer: "적대적 공격 방어",
        isCorrect: true,
        explanation: "AI 시스템의 보안을 강화하기 위해서는 적대적 공격 방어, 데이터 암호화, 접근 제어 등 다양한 방법을 사용해야 합니다. 특히 적대적 공격 방어는 AI 모델이 악의적인 입력에 대해 강건하게 대응할 수 있도록 합니다.",
        showExplanation: false
      },
      {
        question: "AI 모델의 학습에 사용되는 손실 함수의 역할은?",
        answer: "성능 측정",
        isCorrect: false,
        explanation: "손실 함수는 모델의 예측과 실제 값 사이의 차이를 측정하여 모델의 성능을 평가합니다. 이를 통해 모델의 학습 방향을 결정하고 최적화를 수행합니다.",
        showExplanation: false
      },
      {
        question: "AI 시스템의 지속적인 개선을 위한 가장 중요한 요소는?",
        answer: "피드백 루프",
        isCorrect: true,
        explanation: "AI 시스템의 지속적인 개선을 위해서는 사용자 피드백, 성능 모니터링, 데이터 품질 관리 등이 중요합니다. 특히 피드백 루프는 시스템의 성능을 지속적으로 평가하고 개선하는 데 핵심적인 역할을 합니다.",
        showExplanation: false
      },
      {
        question: "AI 모델의 배포 후 모니터링에서 가장 중요한 지표는?",
        answer: "성능 저하",
        isCorrect: true,
        explanation: "AI 모델 배포 후에는 성능 저하, 데이터 드리프트, 이상 징후 등을 지속적으로 모니터링해야 합니다. 이를 통해 모델의 신뢰성과 안정성을 유지할 수 있습니다.",
        showExplanation: false
      },
      {
        question: "AI 시스템의 신뢰성을 높이기 위한 가장 효과적인 방법은?",
        answer: "검증 및 검증",
        isCorrect: false,
        explanation: "AI 시스템의 신뢰성을 높이기 위해서는 철저한 검증과 검증, 투명한 의사결정 과정, 지속적인 모니터링 등이 필요합니다. 특히 검증과 검증은 시스템의 정확성과 안정성을 보장하는 데 중요합니다.",
        showExplanation: false
      }
    ];

    /* 원래 코드
    try {
      // URL에서 subjectId 가져오기
      const subjectId = this.$route.query.subjectId;
      
      if (!subjectId) {
        throw new Error('과목 ID가 누락되었습니다.');
      }

      // userInfo에서 userId 가져오기
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.userId) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }

      // 퀴즈 결과 데이터 가져오기
      const response = await axios.get(`/quiz/results`, {
        params: { 
          subjectId,
          userId: userInfo.userId
        }
      });

      // 데이터 형식 변환
      this.problems = response.data.map(result => ({
        question: result.question,
        answer: result.answer,
        isCorrect: result.isCorrect,
        explanation: result.explanation,
        showExplanation: false
      }));
    } catch (error) {
      console.error('퀴즈 결과를 가져오는데 실패했습니다:', error);
      this.error = '퀴즈 결과를 불러오는데 실패했습니다.';
    }
    */
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
  max-width: 1800px;
  margin: 0 auto;
  position: relative;
  padding: 0 20px;
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
  width: 100%;
}

.result-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  table-layout: fixed;
}

.result-table th,
.result-table td {
  padding: 20px;
  text-align: left;
  border-bottom: 1px solid #eee;
  word-wrap: break-word;
}

.result-table th:nth-child(1) { width: 8%; }  /* 번호 */
.result-table th:nth-child(2) { width: 12%; } /* 정답 여부 */
.result-table th:nth-child(3) { width: 35%; } /* 문제 */
.result-table th:nth-child(4) { width: 20%; } /* 답 */
.result-table th:nth-child(5) { width: 25%; } /* 해설 */

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
  .result-container {
    padding: 0 10px;
  }

  .result-table th,
  .result-table td {
    padding: 15px;
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