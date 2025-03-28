<template>
  <div class="shop-view">
    <div class="header">
      <h1>포인트 샵 🛍️</h1>
      <p class="subtitle">포인트로 특별한 아이템을 구매해보세요!</p>
    </div>

    <div class="user-info">
      <div class="user-card">
        <span class="user-icon">👤</span>
        <div class="user-content">
          <span class="user-name">{{ studentName }}</span>
          <span class="user-points">{{ points }} 포인트</span>
        </div>
      </div>
    </div>

    <div class="shop-container">
      <div class="product-card">
        <div class="product-image">
          <img src="https://www.megacoffee.com/images/menu/coffee.png" alt="메가커피 기프트콘">
        </div>
        <div class="product-info">
          <h3 class="product-name">메가커피 기프트콘</h3>
          <p class="product-price">2,000 포인트</p>
          <button class="buy-button" @click="handlePurchase">
            <span class="button-text">구매하기</span>
            <span class="button-icon">🛒</span>
          </button>
        </div>
      </div>
    </div>

    <div class="history-section">
      <div class="button-group">
        <button class="history-button" @click="viewHistory">
          <span class="button-text">구매내역 보기</span>
          <span class="button-icon">📋</span>
        </button>
        <button class="menu-button" @click="goToMainMenu">
          <span class="button-text">메인메뉴로 돌아가기</span>
          <span class="button-icon">🏠</span>
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
export default {
  name: 'PointShop',
  data() {
    return {
      studentName: '홍길동', // 임시 데이터
      points: 10000 // 임시 데이터
    }
  },
  methods: {
    handlePurchase() {
      if (this.points >= 2000) {
        alert('구매가 완료되었습니다!');
        this.points -= 2000;
      } else {
        alert('포인트가 부족합니다.');
      }
    },
    viewHistory() {
      alert('구매내역 보기 기능은 준비 중입니다.');
    },
    goToMainMenu() {
      this.$router.push('/studentmenu');
    }
  }
}
</script>

<style scoped>
.shop-view {
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

.user-info {
  width: 100%;
  max-width: 800px;
  margin-bottom: 40px;
}

.user-card {
  background: white;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.user-icon {
  font-size: 2.5em;
}

.user-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.user-name {
  font-size: 1.4em;
  font-weight: bold;
  color: #2c3e50;
}

.user-points {
  font-size: 1.2em;
  color: #ff6b6b;
  font-weight: 500;
}

.shop-container {
  width: 100%;
  max-width: 800px;
  margin-bottom: 40px;
}

.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.product-image {
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  text-align: center;
  width: 100%;
}

.product-name {
  font-size: 1.5em;
  color: #2c3e50;
  margin-bottom: 10px;
}

.product-price {
  font-size: 1.3em;
  color: #ff6b6b;
  font-weight: bold;
  margin-bottom: 20px;
}

.buy-button {
  padding: 12px 25px;
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

.buy-button:hover {
  background-color: #ff6b6b;
  transform: translateY(-3px);
}

.history-section {
  margin-top: 40px;
}

.button-group {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.history-button {
  padding: 15px 30px;
  font-size: 1.2em;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.history-button:hover {
  background-color: #45a049;
  transform: translateY(-3px);
}

.menu-button {
  padding: 15px 30px;
  font-size: 1.2em;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.menu-button:hover {
  background-color: #ff5252;
  transform: translateY(-3px);
}

.button-text {
  font-weight: bold;
}

.button-icon {
  font-size: 1.2em;
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

  .user-card {
    padding: 15px;
  }

  .user-icon {
    font-size: 2em;
  }

  .product-image {
    width: 150px;
    height: 150px;
  }

  .product-name {
    font-size: 1.3em;
  }

  .product-price {
    font-size: 1.1em;
  }

  .buy-button, .history-button, .menu-button {
    padding: 10px 20px;
    font-size: 1.1em;
  }

  .deco-item {
    font-size: 2em;
  }

  .button-group {
    flex-direction: column;
    gap: 15px;
  }
}
</style> 