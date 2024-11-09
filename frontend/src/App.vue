<template>
  <div class = "main">
    <router-link to="/main">광운 마켓</router-link>
  </div>
  <div class="login">
    <router-link to="/login">로그인 | 회원가입</router-link>
  </div>
  <nav>
    <router-link to="/search">상품 검색</router-link>
    <router-link to="/regist">상품 등록</router-link>
    <router-link to="/price">시세 조회</router-link>
    <router-link to="/board">자유게시판</router-link>
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

div.main a {
  font-size: 50px;
  font-weight: bold;
  text-decoration: none;
  color: #2c3e50;
  padding-top: 50px;
}

div.login a {
  font-size: 12px;
  font-weight: bold;
  text-decoration: none;
  float: right;
  margin-right: 300px;
  color: #2c3e50;
}

div a.router-link-exact-active {
  color: #42b983;
}

nav {
  margin: 30px;
  border-style: solid;
  border-color: black;
  border-radius: 10px;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

nav a {
  font-size: 30px;
  font-weight: bold;
  text-decoration: none;
  padding: 45px;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

