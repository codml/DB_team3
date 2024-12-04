<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
  
  <div class="findID">
    <h1>아이디 찾기</h1>
    <form @submit.prevent="handleFind">
      <div class="input-container">
        <span class="material-symbols-outlined icon-ID">person</span>
        <input v-model="form.userName" id="userName" name="userName" type="text" placeholder="이름을 입력하세요." required />
      </div>
      <div class="input-container">
        <input v-model="form.userEmail" id="userEmail" name="userEmail" type="text" placeholder="이메일을 입력하세요." required />
        <span class="material-symbols-outlined icon-Mail">mail</span>
      </div>
      <div class="button-container">
        <button class="fade-button" type="submit">아이디 찾기</button>
      </div>
    </form>    
  </div>
  <br>
  <div class="sub-link">
    <a href="/login" class="link">로그인</a> | 
    <a href="/signup" class="link">회원가입</a> | 
    <a href="/account/password" class="link">비밀번호 찾기</a>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        userName: '',
        userEmail: ''
      }
    };
  },
  methods: {
    async handleFind() {
      try {
        if (this.form.userName && this.form.userEmail) {
          console.log('아이디 찾기:', this.form.userName, this.form.userEmail);
          const response = await axios.post('http://localhost:3000/account/id', this.form);
          console.log('서버 응답:', response.data.message);

          if (response.data.message === 'success') {
            alert('아이디가 회원님의 이메일로 성공적으로 전송되었습니다.\n메일을 확인해주세요.');

            // 사용자에게 확인 메시지 표시
            if (confirm('로그인 페이지로 이동하시겠습니까?')) {
              this.$router.push({name: 'login'});  // '예' 선택 시 '/login'으로 이동
            } else {
              this.$router.push({name: 'main'});   // '아니오' 선택 시 '/main'으로 이동
            }
          } 
          else if (response.data.message === 'fail') {
            alert('잘못된 회원정보 입니다.');
          }
        } 
        else {
          alert('이름과 이메일을 입력하세요.');
        }
      } 
      catch (error) {
        console.error('오류 발생:', error);
        alert('회원정보 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  }
};
</script>

<style scoped>

.findID {
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
.icon-Mail {
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

.icon-Mail {
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

.sub-link a {
  font-size: 15px;
  font-weight: bold;
  text-decoration: none;
  color: #2c3e50;
}

</style>