<template>
  <div class="signup">
    <h1>회원가입</h1>
    <form @submit.prevent="handleSubmit">
      <div class="input1">
         <label for="input1">이름</label><br>
         <input v-model="form.name" id="input1" name="name" type="text" required/>
      </div>
      <div class="input2">
         <label for="input2">나이</label><br>
         <input v-model="form.age" id="input2" name="age" type="number" min="0" max="200" required/>
      </div>
      <div class="input3">
         <label>성별</label><br>
         <input v-model="form.gender" id="male" name="gender" type="radio" value="남" checked/>
         <label for="male">남</label>
         <input v-model="form.gender" id="female" name="gender" type="radio" value="여"/>
         <label for="female">여</label>
      </div>
      <div class="input4">
         <label for="input4">전화번호</label><br>
         <input v-model="form.tel" id="input4" name="tel" type="text" required/>
      </div>
      <div class="input5">
         <label for="input5">이메일</label><br>
         <input v-model="form.email" id="input5" name="email" type="text" required/>
      </div>
      <div class="input6">
         <label for="input6">주소</label><br>
         <input v-model="form.address" id="input6" name="address" type="text" required/>
      </div>
      <div class="input7">
         <label for="input7">아이디</label><br>
         <input v-model="form.id" id="input7" name="id" type="text" required/>
      </div>
      <div class="input8">
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
        passwd: ''
      }
    };
  },
  methods: {
    handleSubmit() {
      // FormData 객체로 폼 데이터 가져오기
      const formData = new FormData();
      for (const key in this.form) {
        formData.append(key, this.form[key]);
      }

      // Axios를 사용하여 POST 요청 보내기
      axios.post('http://localhost:8080/signup', formData) // 실제 URL로 변경
        .then(response => {
          console.log('Success:', response.data);
          // 성공 시 처리할 내용 추가 (예: 사용자에게 알림)
        })
        .catch(error => {
          console.error('Error:', error);
          // 에러 발생 시 처리할 내용 추가 (예: 오류 메시지 표시)
        });
    }
  }
};
</script>

<style scoped>
/* 스타일은 동일 */
.signup {
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  border-style: solid;
  border-radius: 10px;
  width: 500px;
  height: 900px;
}

h1 {
  margin: 20px;
}

div.input1 {
  margin: 20px;
}

div.input2 {
  margin: 20px;
}

div.input3 {
  margin: 20px;
}

div.input4 {
  margin: 20px;
}

div.input5 {
  margin: 20px;
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

#btn_signup {
   padding: 12px 24px;        /* 버튼 크기 조절 */
   font-size: 16px;           /* 텍스트 크기 */
   border: none;              /* 기본 테두리 제거 */
   border-radius: 5px;        /* 모서리를 둥글게 */
   background-color: #007bff; /* 배경색 */
   color: white;              /* 텍스트 색상 */
   cursor: pointer;           /* 커서 포인터 */
   margin-top: 10px;          /* 버튼과 라디오 그룹 간격 */
}
</style>
