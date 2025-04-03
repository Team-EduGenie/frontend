<template>
  <div class="student-dashboard">
    <h1>나의 학습 현황 📊</h1>
    <div class="dashboard-container">
      <!-- 과목 선택 섹션 -->
      <div class="subject-selector">
        <h2>문제 세트 선택</h2>
        <div class="subject-list">
          <div 
            v-for="set in problemSets" 
            :key="set.id"
            :class="['subject-item', { active: selectedSet === set.id }]"
            @click="selectSet(set.id)"
          >
            <span class="subject-icon">📝</span>
            <span class="subject-name">{{ set.name }}</span>
          </div>
        </div>
      </div>

      <!-- 틀린 문제 목록 또는 차트 섹션 -->
      <div class="content-section">
        <template v-if="selectedSet">
          <div class="wrong-answers">
            <h2>틀린 문제 목록</h2>
            <div class="quiz-list">
              <div v-for="quiz in wrongQuizzes" :key="quiz.id" class="quiz-item">
                <div class="quiz-header">
                  <span class="quiz-number">문제 {{ quiz.number }}</span>
                  <span class="quiz-date">{{ quiz.date }}</span>
                </div>
                <div class="quiz-content">
                  <p class="quiz-question">{{ quiz.question }}</p>
                  <div class="quiz-details">
                    <div class="answer-info">
                      <div class="answer wrong">
                        <span class="label">내가 선택한 답</span>
                        <span class="value">{{ quiz.userAnswer }}</span>
                      </div>
                      <div class="answer correct">
                        <span class="label">정답</span>
                        <span class="value">{{ quiz.correctAnswer }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="quiz-explanation">
                    <h4>📝 문제 해설</h4>
                    <p>{{ quiz.explanation }}</p>
                  </div>
                </div>
              </div>
              <div v-if="wrongQuizzes.length === 0" class="no-quizzes">
                선택한 문제 세트에 틀린 문제가 없습니다.
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="score-chart">
            <h2>시험별 성적 현황</h2>
            <div class="chart-container">
              <canvas ref="scoreChart"></canvas>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 챗봇 토글 버튼 -->
    <div 
      class="chat-toggle-button"
      @click="showChat = true"
      v-if="!showChat"
    >
      <span class="toggle-icon">🤖</span>
    </div>

    <!-- 채팅창 섹션 -->
    <div 
      class="chat-section" 
      :class="{ 'maximized': isMaximized }"
      :style="{ top: chatPosition.y + 'px', right: chatPosition.x + 'px' }"
      @mousedown="startDragging"
      v-if="showChat"
    >
      <div class="chat-header" :style="{ cursor: isDragging ? 'grabbing' : 'grab' }">
        <h2>AI 학습 도우미 🤖</h2>
        <div class="header-controls">
          <span class="status-dot"></span>
          <button class="maximize-button" @click="toggleMaximize">
            <span class="maximize-icon">{{ isMaximized ? '─' : '🗖' }}</span>
          </button>
          <button class="close-button" @click="showChat = false">×</button>
        </div>
      </div>
      <div class="chat-messages" ref="chatMessages">
        <div v-for="(msg, index) in messages" :key="index" 
             :class="['message', msg.type]">
          <div class="message-content">
            {{ msg.content }}
          </div>
          <div v-if="msg.type === 'bot'" class="message-time">{{ msg.time }}</div>
        </div>
        <div v-if="isTyping" class="message bot">
          <div class="message-content typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div class="chat-actions">
        <button 
          class="action-button similar-quiz"
          @click="generateSimilarQuiz"
          :disabled="!selectedSet"
        >
          <span class="button-icon">📝</span>
          유사 문제 생성
        </button>
        <button 
          class="action-button analyze"
          @click="analyzeWeakness"
          :disabled="!selectedSet"
        >
          <span class="button-icon">📊</span>
          취약 유형 분석
        </button>
      </div>
      <div class="chat-input">
        <input 
          type="text" 
          v-model="message" 
          placeholder="메시지를 입력하세요..."
          @keyup.enter="sendMessage"
        >
        <button @click="sendMessage">
          <span class="send-icon">📤</span>
        </button>
      </div>
    </div>
    <!-- 뒤로가기 버튼 추가 -->
    <div class="back-button-container">
      <button @click="goBack" class="back-button">
        <span class="back-icon">←</span>
        메인 메뉴로 돌아가기
      </button>
    </div>
  </div>
</template>

<script>
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, BarController } from 'chart.js'
import axios from 'axios'

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'StudentDashboard',
  data() {
    return {
      selectedSet: null,
      problemSets: [
        { id: 1, name: 'KT TECH NEW LEARN - IT핵심기술', score: 9 },
        { id: 2, name: 'KT TECH NEW LEARN - IT 트렌드', score: 8 },
        { id: 3, name: 'Leash반 PCCE JAVA 자격증 스터디', score: 6 },
        { id: 4, name: 'KT Azure Study', score: 3 }
      ],
      wrongQuizzes: [],
      chart: null,
      message: '',
      messages: [
        {
          type: 'bot',
          content: '안녕하세요! 학습에 관련된 질문이 있으시면 언제든지 물어보세요.',
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }
      ],
      chatPosition: {
        x: 20,
        y: 50
      },
      isDragging: false,
      dragOffset: {
        x: 0,
        y: 0
      },
      showChat: false,
      isTyping: false,
      isGenerating: false,
      isMaximized: false
    }
  },
  methods: {
    async fetchSubjects() {
      /* 기존 백엔드 연동 코드 주석 처리
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const groupId = userInfo?.groupInfo?.groupId;
        
        if (!groupId) {
          console.error('그룹 정보를 찾을 수 없습니다.');
          return;
        }

        // 과목 목록 가져오기
        const response = await axios.get('/subjects', {
          params: { groupId }
        });

        if (response.data.success) {
          this.problemSets = response.data.subjects.map(subject => ({
            id: subject.id,
            name: subject.name
          }));

          // 각 과목의 점수 정보 가져오기
          const scoresResponse = await axios.get('/leaderboard', {
            params: { groupId }
          });

          if (scoresResponse.data.success) {
            // 각 과목별 점수 정보를 problemSets에 추가
            this.problemSets = this.problemSets.map(set => ({
              ...set,
              score: scoresResponse.data.scores[set.id] || 0
            }));

            // 차트 초기화
            this.$nextTick(() => {
              this.initChart();
            });
          }
        }
      } catch (error) {
        console.error('과목 목록을 가져오는데 실패했습니다:', error);
      }
      */

      // 더미 데이터로 차트 초기화
      this.$nextTick(() => {
        this.initChart();
      });
    },

    async fetchWrongQuizzes(subjectId) {
      /* 기존 백엔드 연동 코드 주석 처리
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const userId = userInfo?.userId;
        
        if (!userId) {
          console.error('사용자 정보를 찾을 수 없습니다.');
          return;
        }

        // 틀린 문제 목록 가져오기
        const response = await axios.get('/quiz-user/wrong', {
          params: {
            subjectId,
            userId
          }
        });

        if (response.data.success) {
          this.wrongQuizzes = response.data.wrongQuizzes.map(quiz => ({
            id: quiz.quizId,
            number: quiz.number,
            question: quiz.question,
            userAnswer: quiz.userAnswer,
            correctAnswer: quiz.correctAnswer,
            date: new Date(quiz.createTime).toLocaleDateString('ko-KR')
          }));
        }
      } catch (error) {
        console.error('틀린 문제 목록을 가져오는데 실패했습니다:', error);
      }
      */

      // 더미 데이터로 틀린 문제 목록 설정
      this.wrongQuizzes = [
        {
          id: 1,
          number: 1,
          question: '클라우드 컴퓨팅의 주요 특징은 무엇인가요?',
          userAnswer: '확장성',
          correctAnswer: '유연성',
          explanation: '클라우드 컴퓨팅의 가장 중요한 특징은 유연성입니다. 필요에 따라 자원을 즉시 확장하거나 축소할 수 있어 비즈니스 요구사항에 빠르게 대응할 수 있습니다.',
          date: new Date().toLocaleDateString('ko-KR')
        },
        {
          id: 2,
          number: 2,
          question: 'DevOps의 핵심 원칙은?',
          userAnswer: '자동화',
          correctAnswer: '협업',
          explanation: 'DevOps의 핵심은 개발(Development)과 운영(Operations) 팀 간의 협업입니다. 자동화도 중요한 요소이지만, 가장 근본적인 원칙은 팀 간의 원활한 협업과 소통입니다.',
          date: new Date().toLocaleDateString('ko-KR')
        }
      ];
    },

    async selectSet(setId) {
      if (this.selectedSet === setId) {
        this.selectedSet = null;
        this.wrongQuizzes = [];
        this.$nextTick(() => {
          this.initChart();
        });
      } else {
        this.selectedSet = setId;
        await this.fetchWrongQuizzes(setId);
      }
    },

    reviewQuiz(quizId) {
      this.$router.push({
        path: '/exam',
        query: {
          subjectId: this.selectedSet,
          quizId: quizId
        }
      });
    },

    initChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.scoreChart.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.problemSets.map(set => set.name),
          datasets: [{
            label: '시험 점수',
            data: this.problemSets.map(set => set.score),
            backgroundColor: '#ff6b6b',
            borderColor: '#ff5252',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 10,
              ticks: {
                stepSize: 1,
                callback: function(value) {
                  return value + '점';
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.parsed.y + '점';
                }
              }
            }
          }
        }
      });
    },
    goBack() {
      this.$router.push('/studentmenu');
    },
    async sendMessage() {
      if (!this.message.trim()) return;

      // 사용자 메시지 추가
      const userMessage = {
        type: 'user',
        content: this.message.trim(),
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      };
      this.messages.push(userMessage);
      
      // 입력창 초기화 및 스크롤
      this.message = '';
      this.$nextTick(() => {
        this.scrollToBottom();
      });

      // 타이핑 표시 시작
      this.isTyping = true;

      try {
        // OpenAI API 키 확인
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        if (!apiKey) {
          throw new Error('API 키가 설정되지 않았습니다. .env 파일에 VITE_OPENAI_API_KEY를 설정해주세요.');
        }

        console.log('API 키가 설정되어 있습니다.');

        // OpenAI API 호출
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "당신은 학생들의 학습을 돕는 AI 튜터입니다. 친절하고 명확하게 답변해주세요."
            },
            {
              role: "user",
              content: userMessage.content
            }
          ]
        }, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('API 응답:', response.data);  // API 응답 확인

        // 봇 응답 추가
        const botMessage = {
          type: 'bot',
          content: response.data.choices[0].message.content,
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        };
        this.messages.push(botMessage);

      } catch (error) {
        // 에러 발생 시 에러 메시지 표시
        this.messages.push({
          type: 'bot',
          content: '죄송합니다. 응답을 받아오는 중에 문제가 발생했습니다.',
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        });
        console.error('OpenAI API Error:', error);
      }

      // 타이핑 표시 종료
      this.isTyping = false;
      
      // 스크롤
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      const chatMessages = this.$refs.chatMessages;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    },
    startDragging(event) {
      // 헤더 부분만 드래그 가능하도록
      if (!event.target.closest('.chat-header')) return;
      
      this.isDragging = true;
      const chatBox = event.target.closest('.chat-section');
      const rect = chatBox.getBoundingClientRect();
      
      // 마우스 위치와 채팅창의 위치 차이를 저장
      this.dragOffset = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      
      // 이벤트 리스너 추가
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.stopDragging);
    },
    
    onDrag(event) {
      if (!this.isDragging) return;
      
      // 새로운 위치 계산 (마우스 위치 기준)
      const newX = window.innerWidth - (event.clientX - this.dragOffset.x) - 300;
      const newY = event.clientY - this.dragOffset.y;
      
      // 화면 경계 제한
      this.chatPosition = {
        x: Math.max(0, Math.min(window.innerWidth - 300, newX)),
        y: Math.max(0, Math.min(window.innerHeight - 600, newY))
      };
    },
    
    stopDragging() {
      this.isDragging = false;
      // 이벤트 리스너 제거
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.stopDragging);
    },

    toggleMaximize() {
      this.isMaximized = !this.isMaximized;
      if (!this.isMaximized) {
        // 최소화 시 원래 위치로 복원
        this.chatPosition = {
          x: 20,
          y: 50
        };
      }
    },

    async generateSimilarQuiz() {
      if (this.isGenerating) return;
      this.isGenerating = true;
      
      try {
        const systemPrompt = [
          "너는 AI 기반 맞춤형 튜터야. 학생이 제공한 문제와 오답을 바탕으로, 학생이 어떤 부분을 잘못 이해했는지 파악하고 친절하게 설명해줘.",
          "",
          "- 학습 과목은 고정되어 있지 않으며, 초등학생 수준의 기초 개념부터 성인을 위한 자격증, 영어, 자기계발 등 어떤 주제든 나올 수 있어.",
          "- 문제의 내용에서 주제를 스스로 파악하고, 그에 맞는 개념을 선정해서 설명해줘.",
          "- 학생의 오답을 분석해서 어떤 개념을 잘못 이해했는지 또는 어떤 개념이 누락되었는지를 판단해줘.",
          "- 학생의 답변이나 문제의 난이도를 참고해서 학생의 수준을 추정하고, 그에 맞게 설명의 난이도와 말투를 조절해줘.",
          "- 어려운 용어나 전문적인 내용이 필요할 경우에도, 가능한 한 쉽게 풀어서 설명해줘.",
          "- 비유, 실생활 예시, 간단한 도식적인 설명을 활용해서 이해를 도와줘.",
          "- 틀린 이유를 설명할 때는 부드럽고 따뜻한 말투로 접근하고, 긍정적인 학습 경험이 되도록 격려해줘.",
          "",
          "이제부터 너는 학생의 수준과 학습 주제를 자동으로 파악해서 맞춤형 설명을 제공하는 '전천후 AI 선생님'이야.",
          "",
          "다음 형식으로 응답해주세요:",
          "",
          "[유사 문제]",
          "질문: (새로운 질문)",
          "정답: (정답)",
          "해설: (문제 해설)"
        ].join("\n");

        // 현재 선택된 문제 세트의 틀린 문제들 가져오기
        const wrongQuizzes = this.wrongQuizzes;
        if (!wrongQuizzes.length) {
          this.messages.push({
            type: 'bot',
            content: '분석할 틀린 문제가 없습니다.',
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
          });
          return;
        }

        this.isTyping = true;
        
        // OpenAI API 호출
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: `다음 문제를 참고하여 유사한 새로운 문제를 만들어주세요:\n\n질문: ${wrongQuizzes[0].question}\n정답: ${wrongQuizzes[0].correctAnswer}\n해설: ${wrongQuizzes[0].explanation}`
            }
          ]
        }, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        const botMessage = {
          type: 'bot',
          content: response.data.choices[0].message.content,
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        };
        this.messages.push(botMessage);

      } catch (error) {
        console.error('Error generating similar quiz:', error);
        this.messages.push({
          type: 'bot',
          content: '죄송합니다. 문제 생성 중 오류가 발생했습니다.',
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        });
      } finally {
        this.isTyping = false;
        this.isGenerating = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    async analyzeWeakness() {
      if (this.isGenerating) return;
      this.isGenerating = true;

      try {
        const systemPrompt = [
          "너는 AI 기반 맞춤형 튜터야. 학생이 제공한 문제와 오답을 바탕으로, 학생이 어떤 부분을 잘못 이해했는지 파악하고 친절하게 설명해줘.",
          "",
          "- 학습 과목은 고정되어 있지 않으며, 초등학생 수준의 기초 개념부터 성인을 위한 자격증, 영어, 자기계발 등 어떤 주제든 나올 수 있어.",
          "- 문제의 내용에서 주제를 스스로 파악하고, 그에 맞는 개념을 선정해서 설명해줘.",
          "- 학생의 오답을 분석해서 어떤 개념을 잘못 이해했는지 또는 어떤 개념이 누락되었는지를 판단해줘.",
          "- 학생의 답변이나 문제의 난이도를 참고해서 학생의 수준을 추정하고, 그에 맞게 설명의 난이도와 말투를 조절해줘.",
          "- 어려운 용어나 전문적인 내용이 필요할 경우에도, 가능한 한 쉽게 풀어서 설명해줘.",
          "- 비유, 실생활 예시, 간단한 도식적인 설명을 활용해서 이해를 도와줘.",
          "- 틀린 이유를 설명할 때는 부드럽고 따뜻한 말투로 접근하고, 긍정적인 학습 경험이 되도록 격려해줘.",
          "",
          "이제부터 너는 학생의 수준과 학습 주제를 자동으로 파악해서 맞춤형 설명을 제공하는 '전천후 AI 선생님'이야.",
          "",
          "다음 형식으로 응답해주세요:",
          "",
          "[취약점 분석]",
          "1. 주요 취약 영역:",
          "- (취약한 부분 나열)",
          "",
          "2. 원인 분석:",
          "- (왜 이런 실수가 발생했는지 분석)",
          "",
          "3. 개선 방안:",
          "- (구체적인 학습 제안)",
          "",
          "4. 추천 학습 자료:",
          "- (관련 학습 자료 추천)"
        ].join("\n");

        const wrongQuizzes = this.wrongQuizzes;
        if (!wrongQuizzes.length) {
          this.messages.push({
            type: 'bot',
            content: '분석할 틀린 문제가 없습니다.',
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
          });
          return;
        }

        this.isTyping = true;

        // OpenAI API 호출
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: `다음 틀린 문제들을 분석해주세요:\n\n${wrongQuizzes.map(quiz => `문제: ${quiz.question}\n학생 답안: ${quiz.userAnswer}\n정답: ${quiz.correctAnswer}\n해설: ${quiz.explanation}\n`).join('\n')}`
            }
          ]
        }, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        const botMessage = {
          type: 'bot',
          content: response.data.choices[0].message.content,
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        };
        this.messages.push(botMessage);

      } catch (error) {
        console.error('Error analyzing weakness:', error);
        this.messages.push({
          type: 'bot',
          content: '죄송합니다. 분석 중 오류가 발생했습니다.',
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        });
      } finally {
        this.isTyping = false;
        this.isGenerating = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    }
  },
  async created() {
    await this.fetchSubjects();
  },
  beforeDestroy() {
    // 컴포넌트가 제거될 때 이벤트 리스너 정리
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDragging);
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
</script>

<style scoped>
.student-dashboard {
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
  background-color: #fff5f5;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(255,182,193,0.3) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(255,218,185,0.3) 0%, transparent 20%);
  border-radius: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  position: relative;
}

h1 {
  color: #ff6b6b;
  margin-bottom: 30px;
  font-size: 2.5em;
  text-align: center;
}

.dashboard-container {
  display: flex;
  gap: 30px;
  min-height: 800px;
}

.subject-selector {
  width: 300px;
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-height: 800px;
}

.subject-selector h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.subject-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.subject-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.subject-item:hover {
  background: #fff5f5;
  transform: translateY(-2px);
}

.subject-item.active {
  background: #ff6b6b;
  color: white;
}

.subject-icon {
  font-size: 1.2em;
}

.subject-name {
  font-size: 1.1em;
  font-weight: 500;
}

.content-section {
  flex: 1;
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  min-height: 800px;
}

.wrong-answers {
  width: 100%;
}

.wrong-answers h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.quiz-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quiz-item {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.quiz-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.quiz-number {
  font-size: 1.1em;
  font-weight: 600;
  color: #ff6b6b;
}

.quiz-date {
  color: #888;
  font-size: 0.9em;
}

.quiz-question {
  font-size: 1.2em;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 20px;
  line-height: 1.5;
  font-family: 'Pretendard', sans-serif;
}

.quiz-details {
  margin-bottom: 20px;
}

.answer-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.answer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #f8f9fa;
}

.answer .label {
  font-size: 0.95em;
  color: #666;
  min-width: 100px;
}

.answer .value {
  font-weight: 600;
  font-size: 1.1em;
}

.answer.wrong {
  background: #fff5f5;
}

.answer.wrong .value {
  color: #ff6b6b;
}

.answer.correct {
  background: #f1f9f1;
}

.answer.correct .value {
  color: #4CAF50;
}

.quiz-explanation {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  margin-top: 20px;
}

.quiz-explanation h4 {
  font-size: 1.1em;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 600;
}

.quiz-explanation p {
  color: #444;
  line-height: 1.6;
  font-size: 1em;
  font-family: 'Pretendard', sans-serif;
}

.no-quizzes, .no-subject {
  text-align: center;
  color: #5c6b7a;
  padding: 40px;
  font-size: 1.1em;
}

.score-chart {
  height: 100%;
  min-height: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.score-chart h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.5em;
}

.chart-container {
  height: 600px;
  position: relative;
  flex: 1;
  margin-top: 20px;
}

.back-button-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: white;
  border: 2px solid #ff6b6b;
  border-radius: 25px;
  color: #ff6b6b;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #ff6b6b;
  color: white;
  transform: translateY(-2px);
}

.back-icon {
  font-size: 1.2em;
}

.chat-toggle-button {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: #ff6b6b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 1000;
}

.chat-toggle-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.toggle-icon {
  font-size: 1.8em;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.maximize-button,
.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.maximize-button:hover,
.close-button:hover {
  transform: scale(1.2);
}

.maximize-icon {
  font-size: 1.2em;
}

.chat-section {
  position: fixed;
  transform: none;
  width: 400px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 600px;
  z-index: 1000;
  user-select: none;
  animation: slideIn 0.3s ease;
  transition: all 0.3s ease;
}

.chat-section.maximized {
  width: 90vw;
  height: 90vh;
  top: 5vh !important;
  left: 5vw !important;
  right: auto !important;
  transform: none !important;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: grab;
  background: #ff6b6b;
  color: white;
  border-radius: 20px 20px 0 0;
}

.chat-header h2 {
  color: white;
  margin: 0;
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #4CAF50;
  border-radius: 50%;
}

.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 15px;
  margin-bottom: 12px;
  position: relative;
}

.message.bot {
  align-self: flex-start;
  background-color: #f0f2f5;
  color: #2c3e50;
  margin-right: 40px;
}

.message.user {
  align-self: flex-end;
  background-color: #ff6b6b;
  color: white;
  margin-left: 40px;
}

.message-content {
  word-break: break-word;
  line-height: 1.4;
}

.message-time {
  position: absolute;
  bottom: -18px;
  left: 0;
  font-size: 0.75em;
  color: #666;
}

.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  min-width: 60px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #90949c;
  border-radius: 50%;
  animation: bounce 1.3s linear infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

.chat-input {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

.chat-input input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #eee;
  border-radius: 20px;
  outline: none;
  font-size: 1em;
}

.chat-input button {
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chat-input button:hover {
  background: #ff5252;
  transform: scale(1.1);
}

.send-icon {
  font-size: 1.2em;
}

.chat-actions {
  padding: 10px 15px;
  display: flex;
  gap: 10px;
  border-top: 1px solid #eee;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 0.9em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-button.similar-quiz {
  background-color: #4CAF50;
  color: white;
}

.action-button.analyze {
  background-color: #2196F3;
  color: white;
}

.action-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.button-icon {
  font-size: 1.2em;
}

@media (max-width: 1200px) {
  .chat-section {
    display: none;
  }
  
  .dashboard-container {
    min-height: 700px;
  }

  .subject-selector,
  .content-section {
    min-height: 700px;
  }
}

@media (max-width: 768px) {
  .student-dashboard {
    padding: 20px;
    margin: 10px;
    min-height: calc(100vh - 20px);
  }

  .dashboard-container {
    flex-direction: column;
    min-height: auto;
  }

  .subject-selector {
    width: 100%;
    min-height: 500px;
  }

  .content-section {
    min-height: 500px;
  }

  .chart-container {
    height: 400px;
  }

  h1 {
    font-size: 2em;
  }

  .quiz-item {
    padding: 16px;
  }

  .quiz-details {
    flex-direction: column;
    gap: 15px;
  }

  .review-button {
    width: 100%;
  }

  .score-chart {
    min-height: 300px;
  }

  .chart-container {
    height: 300px;
  }

  .back-button {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}
</style> 