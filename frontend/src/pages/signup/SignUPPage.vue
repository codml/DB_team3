<template>
  <div class="signup">
    <h1>회원가입</h1>
    <form action="">
      <div class="input1">
        <label for="input1">항목1</label><br>
        <input id="input1" name="input1" type="text" />
      </div>
      <div class="input2">
        <label for="input2">항목2</label><br>
        <input id="input2" name="input2" type="text" />
      </div>
      <div class="input3">
        <label for="input3">항목3</label><br>
        <input id="input3" name="input3" type="text" />
      </div>
      <div class="input4">
        <label for="input4">항목4</label><br>
        <input id="input4" name="input4" type="text" />
      </div>
      <div class="input5">
        <label for="input5">항목5</label><br>
        <input id="input5" name="input5" type="text" />
      </div>
      <button>회원가입</button>
    </form>    
  </div>
</template>

<script>

</script>

<style scoped>

.signup {
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  border-style: solid;
  border-radius: 10px;
  width: 500px;
  height: 580px;
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

</style>