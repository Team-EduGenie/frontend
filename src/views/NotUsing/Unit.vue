<template>
  <div class="unit-view">
    <h1>단원 선택</h1>
    <div v-if="loading" class="loading">
      로딩 중...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    <div v-else class="unit-grid">
      <div 
        v-for="unit in units" 
        :key="unit.unitId"
        @click="handleUnitClick(unit)"
        class="unit-card"
      >
        <div class="unit-icon">{{ getUnitIcon(unit.unitName) }}</div>
        <h2>{{ unit.unitName }}</h2>
        <div :class="getDifficultyClass(unitDifficulties[unit.unitId] || 3)" class="current-difficulty">
          현재 난이도: {{ unitDifficulties[unit.unitId] || 3 }}
          <div class="difficulty-info">
            (난이도는 학습 결과에 따라 자동으로 조절됩니다)
          </div>
        </div>
      </div>
    </div>
    <button @click="goBack" class="back-button">
      <span class="back-icon">←</span> 과목 선택으로 돌아가기
    </button>
  </div>
</template>

<script>
import axiosInst from '../../axios'

export default {
  name: 'Unit',
  data() {
    return {
      units: [],
      loading: false,
      error: null,
      unitDifficulties: {} // 단원별 난이도를 저장할 객체
    }
  },
  methods: {
    getUnitIcon(unitName) {
      const icons = {
        '읽기': '📖',
        '받아쓰기': '✍️',
        '맞춤법': '📝',
        '사칙연산': '➗',
        '창의력': '💡',
        '수식': '📐',
        '역사': '🏛️',
        '정치': '⚖️',
        '경제': '💰',
        '동물': '🐾',
        '식물': '🌱',
        '지구': '🌍'
      };
      return icons[unitName] || '📚';
    },
    async handleUnitClick(unit) {
      try {
        const studentData = JSON.parse(localStorage.getItem('student'));
        if (!studentData || !studentData.studentId) {
          console.error('학생 정보를 찾을 수 없습니다.');
          return;
        }

        // 해당 단원의 현재 난이도 가져오기
        const response = await axiosInst.get('/student-diff/score', {
          params: {
            studentId: studentData.studentId,
            unitId: unit.unitId
          }
        });

        const difficulty = response.data.difficulty || 3;
        this.$set(this.unitDifficulties, unit.unitId, difficulty);

        this.$router.push({
          path: '/quiz',
          query: { 
            unitId: unit.unitId,
            difficulty: difficulty
          }
        });
      } catch (error) {
        this.$router.push({
          path: '/quiz',
          query: { 
            unitId: unit.unitId,
            difficulty: 3
          }
        });
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    async fetchUnitDifficulties() {
      try {
        const studentData = JSON.parse(localStorage.getItem('student'));
        if (!studentData || !studentData.studentId) {
          console.error('학생 정보를 찾을 수 없습니다.');
          return;
        }

        // 모든 단원의 난이도를 가져오기
        const difficulties = {};
        for (const unit of this.units) {
          try {
            const response = await axiosInst.get('/student-diff/score', {
              params: {
                studentId: studentData.studentId,
                unitId: unit.unitId
              }
            });
            
            difficulties[unit.unitId] = response.data.difficulty || 3;
          } catch (error) {
            difficulties[unit.unitId] = 3;
          }
        }
        
        this.unitDifficulties = difficulties;
      } catch (error) {
        this.error = '난이도 정보를 가져오는데 실패했습니다.';
      }
    },
    getDifficultyClass(difficulty) {
      return `difficulty-${difficulty}`;
    }
  },
  async created() {
    this.loading = true;
    try {
      const subjectId = parseInt(this.$route.query.subjectId);
      const unitsResponse = await axiosInst.get(`/units/subject/${subjectId}`);
      this.units = unitsResponse.data;
      await this.fetchUnitDifficulties();
    } catch (error) {
      console.error('데이터를 가져오는데 실패했습니다:', error);
      this.error = '데이터를 가져오는데 실패했습니다.';
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style scoped>
.unit-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #f5f5f5;
}

h1 {
  color: #333;
  margin-bottom: 40px;
  font-size: 2.5em;
  text-align: center;
}

.unit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  margin-bottom: 40px;
}

.unit-card {
  background-color: white;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.unit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.unit-icon {
  font-size: 3em;
  margin-bottom: 10px;
}

h2 {
  margin: 0;
  color: #333;
  font-size: 1.5em;
}

.current-difficulty {
  padding: 10px 15px;
  border-radius: 8px;
  margin-top: 10px;
  font-size: 1.1em;
  text-align: center;
  font-weight: bold;
}

.difficulty-1 {
  background-color: #e9ecef;
  color: #495057;
}

.difficulty-2 {
  background-color: #d0ebff;
  color: #1971c2;
}

.difficulty-3 {
  background-color: #d3f9d8;
  color: #2b8a3e;
}

.difficulty-4 {
  background-color: #fff3bf;
  color: #e67700;
}

.difficulty-5 {
  background-color: #ffe3e3;
  color: #c92a2a;
}

.difficulty-info {
  font-size: 0.8em;
  color: #666;
  margin-top: 5px;
  font-weight: normal;
}

.back-button {
  padding: 15px 30px;
  font-size: 1.1em;
  background-color: #666;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
}

.back-button:hover {
  background-color: #555;
}

.back-icon {
  font-size: 1.2em;
}

.loading {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  color: #666;
}

.error {
  text-align: center;
  padding: 20px;
  color: #f44336;
}

@media (max-width: 768px) {
  .unit-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
}
</style>