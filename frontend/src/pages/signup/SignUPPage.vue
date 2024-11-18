<template>
  <div class="signup">
    <h1>회원가입</h1>
    <form @submit.prevent="handleSubmit">
      <div class="information">
         <label for="input1">이름</label><br>
         <input v-model="form.name" id="input1" name="name" type="text" required/>
      </div>
      <div class="information">
         <label for="input2">나이</label><br>
         <input v-model="form.age" id="input2" name="age" type="number" min="0" max="200" required/>
      </div>
      <div class="information">
         <label>성별</label><br>
         <input v-model="form.gender" id="male" name="gender" type="radio" value="남" checked/>
         <label for="male">남성</label>
         <input v-model="form.gender" id="female" name="gender" type="radio" value="여"/>
         <label for="female">여성</label>
      </div>
      <div class="information">
         <label for="input4">전화번호</label><br>
         <input v-model="form.tel" id="input4" name="tel" type="text" required/>
      </div>
      <div class="information">
         <label for="input5">이메일</label><br>
         <input v-model="form.email" id="input5" name="email" type="text" required/>
      </div>
      <div class="information">
         <label for="input6">주소</label><br>
         <input v-model="form.address" id="input6" name="address" type="text" required/>
      </div>
      <div class="information">
         <label for="input7">아이디</label><br>
         <input v-model="form.id" id="input7" name="id" type="text" required/>
      </div>
      <div class="information">
         <label for="input8">비밀번호</label><br>
         <input v-model="form.passwd" id="input8" name="passwd" type="text" required/>
      </div><br>
      <button id="btn_signup">회원가입</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        name: '',
        age: '',
        gender: '남',
        tel: '',
        email: '',
        address: '',
        id: '',
        passwd: '',
      }
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await axios.post('http://localhost:3000/signup', this.form);
        console.log('서버 응답:', response.data);
        alert('회원가입이 성공적으로 완료되었습니다!');
        
        // 사용자에게 확인 메시지 표시
        if (confirm('로그인 페이지로 이동하시겠습니까?')) {
          this.$router.push({name: 'login'});  // '예' 선택 시 '/login'으로 이동
        } else {
          this.$router.push({name: 'main'});   // '아니오' 선택 시 '/main'으로 이동
        }
      } catch (error) {
        console.error('오류 발생:', error);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  }
};
</script>


<style scoped>
  .signup {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
  }

  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }

  .information {
    margin-bottom: 15px;
  }

  label {
    font-weight: bold;
    color: #555;
  }

  input[type="text"],
  input[type="number"],
  input[type="email"],
  input[type="password"] {
    width: calc(100% - 20px);
    padding: 10px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
  }

  input[type="radio"] {
    margin-right: 5px;
  }

  button {
    width: 100%;
    padding: 10px;
    background-color: #42b983;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }

  button:hover {
    background-color: #369a6e;
  }
</style>
