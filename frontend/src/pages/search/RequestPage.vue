<template>
    <div class="request-page">
      <h1>구매 요청 페이지</h1>
      <p>상품 번호: {{ ino }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: ["ino"], // Vue Router로부터 전달받은 경로 파라미터
  };
  </script>
  
  <style scoped>
  .request-page {
    max-width: 600px;
    margin: 50px auto;
    text-align: center;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  p {
    font-size: 18px;
    color: #333;
  }
  </style>
  