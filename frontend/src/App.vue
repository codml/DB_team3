<template>
  <div class="main">
    <router-link to="/main">광운 마켓</router-link>
  </div>

  <div v-if="!isAuthPage" class="account">
    <div v-if="!isLoggedIn" class="sign">
      <div class="login">
        <router-link to="/login">로그인</router-link>
      </div>
      <div class="signup">
        <router-link to="/signup">회원가입</router-link>
      </div>
    </div>
    <div v-else class="sign">
      <div class="logout">
        <router-link to="/logout" @click="handleLogout">로그아웃</router-link>
      </div>
      <div class="mypage">
        <router-link :to="mypageRoute">마이페이지</router-link>
      </div>
    </div>
  </div>

  <nav v-if="!isAuthPage">
    <router-link to="/search">상품 검색</router-link>
    <router-link to="/regist">상품 등록</router-link>
    <router-link to="/price">시세 조회</router-link>
    <router-link to="/board/page_1">자유게시판</router-link>
  </nav>

  <router-view />
</template>

<script>
import {jwtDecode} from "jwt-decode";

export default {
  computed: {
    isAuthPage() {
      return this.$route.path === '/login' || this.$route.path === '/signup';
    },
    isLoggedIn() {
      const token = localStorage.getItem('token');
      return !!token;
    },
    mypageRoute() {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        return decoded.auth === 0 ? '/userpage' : '/adminpage';
      }
      return '/login';
    }
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

div.main a {
  font-size: 45px;
  font-weight: bold;
  text-decoration: none;
  color: #2c3e50;
}

div.main a.router-link-exact-active {
  color: #2c3e50;
}

div.account {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;  /* 오른쪽 정렬 */
  margin-right: 300px;  /* 오른쪽 여백 */
  align-items: center;  /* 세로 가운데 정렬 */
}

.sign{
  display: flex; /* 버튼들을 가로로 배치 */
  gap: 10px;
}

div.account a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

div a.router-link-exact-active {
  color: #2c3e50;
}

nav {
  margin-top: 10px;
  border-style: solid;
  border-color: black;
  border-radius: 10px;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 1000px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav a {
  font-size: 30px;
  font-weight: bold;
  text-decoration: none;
  color: #2c3e50;
  flex: 1;
  text-align: center;
}


nav a.router-link-exact-active {
  color: #42b983;
}
</style>

