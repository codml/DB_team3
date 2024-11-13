<template>
  <div class="container">
    <!-- Notice Section -->
    <div class="notice-section">
      <h2>【 공지 】</h2>
      <button class="write-button">공지 쓰기</button>
      <div class="notice-list">
        <div class="notice-item" v-for="(notice, index) in notices" :key="index">
          공지글
        </div>
      </div>
      <div class="pagination">
        <button class="pagination-button">이전 페이지</button>
        <button class="pagination-button">다음 페이지</button>
      </div>
    </div>

    <!-- Bulletin Board Section -->
    <div class="bulletin-section">
      <h2>【 게시판 】</h2>
      <button class="write-button">글쓰기</button>
      <div class="bulletin-list">
        <div class="bulletin-item" v-for="(post, index) in posts" :key="index">
          게시글
        </div>
      </div>
      <div class="pagination">
        <button class="pagination-button">이전 페이지</button>
        <button class="pagination-button">다음 페이지</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      notices: Array(3).fill(''), // Sample data for notices
      posts: Array(6).fill(''),   // Sample data for bulletin board posts
    };
  },
};
</script>

<style scoped>
.container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.notice-section,
.bulletin-section {
  border: 1px solid #000;
  margin-bottom: 40px;
  padding: 20px;
}

h2 {
  display: inline-block;
  margin: 0;
}

.write-button {
  float: right;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.notice-list,
.bulletin-list {
  margin-top: 20px;
  border: 1px solid #000;
  padding: 10px;
}

.notice-item,
.bulletin-item {
  border: 1px solid #000;
  padding: 10px;
  margin-bottom: 10px;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}

.pagination-button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;
}
</style>
