<template>
  <div class="login">
    <h1>로그인</h1>
    <form action="">
      <div class="userID">
        <label for="userID">아이디</label><br>
        <input id="userID" name="userID" type="text" />
      </div>
      <div class="userPwd">
        <label for="userPwd">패스워드</label><br>
        <input id="userPwd" name="userPwd" type="password" />
      </div>
      <button>로그인</button>
    </form>    
  </div>
</template>

<script>

</script>

<style scoped>

.login {
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  border-style: solid;
  border-radius: 10px;
  width: 500px;
  height: 400px;
}

h1 {
  margin: 20px;
}

div.userID {
  margin: 50px;
}

div.userPwd {
  margin: 30px;
}

label {
  font-size: 20px;
}

input {
  width: 400px;
  height: 40px;
  border-style: solid;
  border-radius: 5px;
  border-color: black;
  font-size: 18px;
}

</style>