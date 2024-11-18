<template>
  <div id="app">
    <!-- 메인 섹션 -->
    <main class="main-content">
      <!-- 마이페이지 메뉴 -->
      <aside class="sidebar">
        <ul>
          <li @click="navigate('회원정보수정')">회원정보수정</li>
          <li @click="navigate('나의 판매 내역')">나의 판매 내역</li>
          <li @click="navigate('나의 구매 내역')">나의 구매 내역</li>
          <li @click="navigate('내가 찜한 상품')">내가 찜한 상품</li>
        </ul>
      </aside>

      <!-- 사용자 프로필 -->
      <section class="profile">
        <h2>사용자 프로필</h2>
        <div class="profile-content">
          프로필 내용
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import axios from "axios";

export default {
	data() {
    return {
      user: {}, // 회원 정보를 저장할 객체
      loading: true, // 로딩 상태
    };
  },
  
  methods: {
    navigate(page) {
      alert(`${page}로 이동합니다!`);
    },
  },

  mounted() {
    // 마이페이지에 접속하자마자 회원 정보 요청
    axios
      .get("http://localhost:3000/mypage")
      .then((response) => {
        this.user = response.data; // 서버에서 받은 회원 정보 저장
      })
      .catch((error) => {
        console.error("회원 정보 요청 실패:", error);
      })
      .finally(() => {
        this.loading = false; // 로딩 상태 종료
      });
  }
};
</script>

<style scoped>
/* 전체 레이아웃 */
#app {
    width: 960px;
  margin: 0 auto;
  padding: 20px;
  border: solid black;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

/* 메인 컨텐츠 스타일 */
.main-content {
  display: flex;
  padding: 20px;
}

/* 사이드바 스타일 */
.sidebar {
  width: 200px;
  margin-right: 20px;
  border-right: 1px solid #ccc;
  padding-right: 10px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 16px;
}

/* 프로필 섹션 스타일 */
.profile {
  flex: 1;
}

.profile h2 {
  margin-top: 0;
}

.profile-content {
  border: 1px solid #ccc;
  padding: 20px;
  height: 300px;
}
</style>
