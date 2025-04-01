<template>
  <div class="group-menu-view">
    <div class="header">
      <h1>그룹 메뉴 👥</h1>
      <p class="subtitle">그룹을 만들어보거나 참가해보세요!</p>
    </div>
    <div class="menu-container">
      <div class="menu-grid">
        <div class="menu-item create-group" @click="goToGroup">
          <div class="menu-icon">🎯</div>
          <h2>그룹 만들기</h2>
          <p>새로운 그룹을 만들어보세요!</p>
        </div>
        <div class="menu-item join-group" @click="goToJoinGroup">
          <div class="menu-icon">🤝</div>
          <h2>그룹 참가</h2>
          <p>기존 그룹에 참가해보세요!</p>
        </div>
        <div class="menu-item group-choice" @click="goToGroupChoice">
          <div class="menu-icon">👥</div>
          <h2>그룹 선택</h2>
          <p>학습할 그룹을 선택해보세요!</p>
        </div>
      </div>
    </div>
    <div class="bottom-button">
      <button @click="goBack" class="back-button">
        <span class="button-icon">⬅️</span>
        <span class="button-text">뒤로가기</span>
      </button>
    </div>
    <div class="decoration">
      <span class="deco-item pencil">✏️</span>
      <span class="deco-item book">📚</span>
      <span class="deco-item ruler">📏</span>
      <span class="deco-item backpack">🎒</span>
      <span class="deco-item apple">🍎</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupMenu',
  methods: {
    goToGroup() {
      this.$router.push('/group');
    },
    goToJoinGroup() {
      this.$router.push('/join-group');
    },
    goBack() {
      this.$router.push('/studentlogin');
    },
    goToGroupChoice() {
      this.$router.push('/group-choice');
    }
  }
}
</script>

<style scoped>
.group-menu-view {
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

.menu-container {
  width: 100%;
  max-width: 800px;
  position: relative;
  z-index: 1;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 20px;
  width: 100%;
  max-width: 1200px;
}

.menu-item {
  background-color: white;
  border-radius: 30px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(255,135,135,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  height: 100%;
  min-width: 250px;
}

.menu-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(255,135,135,0.3);
}

.menu-icon {
  font-size: 4em;
  margin-bottom: 10px;
  animation: bounce 2s infinite;
}

.menu-item h2 {
  color: #ff6b6b;
  font-size: 2em;
  margin: 0;
  font-weight: bold;
}

.menu-item p {
  color: #ff8787;
  font-size: 1.2em;
  margin: 0;
}

.create-group, .join-group, .group-choice {
  background: linear-gradient(135deg, #fff5f5 0%, #ffe3e3 100%);
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
.book { top: 25%; right: 15%; animation-delay: 1s; }
.ruler { bottom: 20%; left: 15%; animation-delay: 2s; }
.backpack { bottom: 30%; right: 10%; animation-delay: 1.5s; }
.apple { top: 40%; left: 50%; animation-delay: 0.5s; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.bottom-button {
  margin-top: 40px;
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
}

.back-button {
  width: 100%;
  padding: 15px 30px;
  font-size: 1.3em;
  background-color: #fff5f5;
  color: #ff6b6b;
  border: 2px solid #ffc9c9;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(255,107,107,0.2);
}

.back-button:hover {
  background-color: #ff8787;
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(255,107,107,0.3);
}

.back-button .button-icon {
  font-size: 1.2em;
}

.back-button .button-text {
  font-weight: 500;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.5em;
  }

  .subtitle {
    font-size: 1.3em;
  }

  .menu-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .menu-item {
    padding: 30px;
  }

  .menu-icon {
    font-size: 3em;
  }

  .menu-item h2 {
    font-size: 1.8em;
  }

  .menu-item p {
    font-size: 1.1em;
  }

  .deco-item {
    font-size: 2em;
  }

  .bottom-button {
    margin-top: 30px;
    max-width: 300px;
  }

  .back-button {
    font-size: 1.2em;
    padding: 12px 25px;
  }
}
</style> 