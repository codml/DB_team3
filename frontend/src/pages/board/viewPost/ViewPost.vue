<template>
    <div class="view-post-container">
      <h2>게시글 보기</h2>
      <!-- 게시글 제목 -->
      <div class="post-title">
        <strong>{{ post.title }}</strong>
      </div>
      <!-- 게시글 작성자 및 시간 -->
      <div class="post-meta">
        <span class="post-author">작성자: {{ post.author }}</span>
        <span class="post-time">작성 시간: {{ post.time }}</span>
      </div>
      <!-- 게시글 내용 -->
      <div class="post-content">
        <p>{{ post.content }}</p>
      </div>
      <!-- 버튼 -->
      <div class="button-container">
        <button class="back-button" @click="goBack">목록으로</button>
        <button class="edit-button" @click="goToUpdatePost">수정하기</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ViewPost',
    data() {
      return {
        post: {
          title: '',
          author: '',
          time: '',
          content: '',
          images: [], // 이미지 데이터가 있을 경우 저장
        },
        previousPage: 1,
      };
    },
    created() {
      const query = this.$route.query;
      this.post.title = query.title || '제목 없음';
      this.post.author = query.author || '작성자 없음';
      this.post.time = query.time || '시간 없음';
      this.post.content = query.content || '내용 없음';
      this.post.images = query.images || []; // 이미지 데이터를 불러올 수 있도록 추가
      this.previousPage = query.page || 1; // 이전 페이지 정보 저장
    },
    methods: {
      goBack() {
        this.$router.push({ name: 'board', params: { page: this.previousPage } });
      },
      goToUpdatePost() {
        // UpdatePost.vue로 데이터를 전달
        this.$router.push({
          name: 'UpdatePost',
          query: {
            title: this.post.title,
            author: this.post.author,
            time: this.post.time,
            content: this.post.content,
            images: this.post.images, // 이미지 데이터도 전달
          },
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .view-post-container {
    width: 600px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #000;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
  }
  
  .post-title {
    border: 1px solid #000;
    padding: 10px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
  
  .post-meta {
    text-align: right;
    font-size: 14px;
    color: #555;
    margin-bottom: 20px;
    line-height: 1.6; /* 줄 간격 조정 */
  }
  
  .post-author {
    display: block; /* 작성자를 한 줄로 배치 */
  }
  
  .post-time {
    display: block; /* 작성 시간을 다음 줄에 배치 */
  }
  
  .post-content {
    border: 1px solid #000;
    padding: 20px;
    height: 300px;
    overflow-y: auto;
    font-size: 16px;
    line-height: 1.5;
  }
  
  .button-container {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  
  .back-button,
  .edit-button {
    padding: 10px 20px;
    font-size: 14px;
    border: 1px solid #000;
    border-radius: 4px;
    cursor: pointer;
    background-color: #f1f1f1;
    transition: background-color 0.3s;
  }
  
  .back-button:hover,
  .edit-button:hover {
    background-color: #ddd;
  }
  </style>
  