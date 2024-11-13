<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />

  <div class="login">
    <h1>Login</h1>
    <form action="">
      <div class="input-container">
        <span class="material-symbols-outlined icon-ID">person</span>
        <input id="userID" name="userID" type="text" placeholder="아이디를 입력하세요." />
      </div>
      <div class="input-container">
        <input id="userPwd" name="userPwd" type="password" placeholder="비밀번호를 입력하세요." />
        <span class="material-symbols-outlined icon-Lock">lock</span>
      </div>
      <div class="button-container">
        <button class="fade-button">로그인</button>
      </div>
    </form>    
  </div>
</template>

<script>
</script>

<style scoped>

.login {
  margin: 100px auto 0; /* 위쪽에 100px 간격을 두고, 좌우는 자동으로 가운데 정렬 */
  width: 500px;
  text-align: center; /* 내부 요소가 중앙에 배치되도록 설정 */
}

.input-container {
  margin-top: 20px;
  position: relative;
  display: inline-block; /* 중앙 정렬을 위해 inline-block 사용 */
  text-align: center;
  width: auto; /* 필요한 만큼만 넓이 */
}

.icon-ID,
.icon-Lock {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: silver;
  font-size: 24px;
  pointer-events: none;
}

.icon-ID {
  left: 10px; /* 왼쪽 아이콘 위치 */
}

.icon-Lock {
  left: 10px; /* 오른쪽 아이콘 위치 */
}

input {
  width: 270px;
  height: 40px;
  padding-left: 40px; /* 왼쪽 아이콘 공간 확보 */
  padding-right: 40px; /* 오른쪽 아이콘 공간 확보 */
  border-style: solid;
  border-radius: 10px;
  border-color: silver;
  font-size: 18px;
}

.button-container {
  text-align: center; /* 버튼을 가운데 정렬 */
  margin-top: 40px; /* 상단 여백 */
}

.fade-button {
  background-color: #42b983; /* 녹색 배경 */
  color: white; /* 텍스트 색상 */
  border: none; /* 테두리 제거 */
  border-radius: 10px; /* 모서리를 둥글게 */
  width: 353px; /* input과 동일한 너비 */
  height: 45px; /* input과 동일한 높이 */
  font-size: 18px; /* input과 동일한 텍스트 크기 */
  cursor: pointer; /* 포인터 모양 변경 */
  transition: background-color 0.3s; /* 배경색 전환 효과 */
  padding: 0; /* 내부 여백 제거 */
}

</style>
