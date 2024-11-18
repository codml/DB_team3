<template>
    <div>
      <h1>상품 상세 정보</h1>
      <p>상품 번호: {{ ino }}</p>
      <!-- 상품 정보를 표시 -->
    </div>
  </template>
  
  <script>
  export default {
    props: ['ino'], // URL 매개변수로 받은 Ino
    mounted() {
      console.log('상품 번호:', this.ino); // 상품 번호를 로드
      // 여기서 상품 정보를 API로 가져오는 작업 수행
    },
  };
  </script>
  