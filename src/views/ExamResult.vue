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
        question: "AI 거버넌스 플랫폼의 주요 목적 중 하나는 AI 시스템의 의사결정 과정을 사용자에게 명확하게 설명할 수 있도록 하는 것입니다. 이 목적을 달성하기 위해 가장 중요한 기능은 무엇입니까?",
        answer: "투명성 및 설명 가능성",
        isCorrect: true,
        explanation: "AI 거버넌스 플랫폼의 투명성 및 설명 가능성 기능은 AI의 의사결정 과정을 사용자가 이해할 수 있도록 하는 핵심 기능입니다. 이를 통해 AI 시스템의 신뢰성을 높이고, 윤리적 사용을 보장할 수 있습니다.",
        showExplanation: false
      },
      {
        question: "AI 거버넌스 플랫폼이 구현해야 하는 윤리적 고려 중 하나는 AI의 의사결정이 특정 그룹을 차별하지 않도록 모니터링하는 것입니다. 이를 효과적으로 수행하기 위해 가장 중요한 요소는 무엇일까요?",
        answer: "편향 감지 기술",
        isCorrect: false,
        explanation: "편향 감지 기술은 AI 시스템의 의사결정에서 발생할 수 있는 차별적 요소를 식별하고 모니터링하는 데 필수적입니다. 이는 AI의 공정성과 윤리적 사용을 보장하는 핵심 기술입니다.",
        showExplanation: false
      },
      {
        question: "Mastercard가 AI 거버넌스 플랫폼을 도입하여 AI 프로젝트를 중앙에서 추적 관리하고 제3자 AI 공급업체의 신뢰성을 검증하는 사례를 기반으로, 이 플랫폼이 제공하는 주요 가치는 무엇일까요?",
        answer: "사용자 경험 개선",
        isCorrect: false,
        explanation: "Mastercard의 사례에서 AI 거버넌스 플랫폼의 주요 가치는 컴플라이언스 및 감사 용이성입니다. 이는 AI 프로젝트의 중앙 집중식 관리와 제3자 검증을 통해 규정 준수와 감사를 용이하게 하는 기능을 제공합니다.",
        showExplanation: false
      },
      {
        question: "허위정보 보안의 목적은 가짜 뉴스와 조작된 콘텐츠가 초래할 수 있는 피해를 최소화하는 것입니다. 네이버의 사례를 바탕으로 이러한 시스템을 구축하는 데 중요한 기술은 무엇일까요?",
        answer: "인공지능과 머신러닝",
        isCorrect: true,
        explanation: "인공지능과 머신러닝은 허위정보를 식별하고 필터링하는 데 필수적인 기술입니다. 이는 대량의 콘텐츠를 분석하고 패턴을 인식하여 허위정보를 효과적으로 감지할 수 있게 합니다.",
        showExplanation: false
      },
      {
        question: "AI 거버넌스 플랫폼은 AI의 어떤 측면을 감시하여 편향되지 않도록 하며, 기업이 윤리적 원칙과 법규를 준수하도록 지원하는가?",
        answer: "모든 답변이 옳다",
        isCorrect: true,
        explanation: "AI 거버넌스 플랫폼은 데이터 수집, 모델 학습, 의사결정 과정, 운영 단계 등 AI의 모든 측면을 감시하고 관리합니다. 이는 AI 시스템이 윤리적 원칙과 법규를 준수하도록 종합적인 지원을 제공합니다.",
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