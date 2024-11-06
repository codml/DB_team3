<template>
  <nav>
    <router-link to="/main">메인페이지</router-link>
    <router-link to="/login">로그인 페이지</router-link>
    <router-link to="/search">상품 검색 페이지</router-link>
    <router-link to="/regist">상품 등록 페이지</router-link>
    <router-link to="/price">시세 조회 페이지</router-link>
    <router-link to="/board">자유게시판 페이지</router-link>
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  margin-right: 10px; /* 링크 간 간격 설정 */
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

