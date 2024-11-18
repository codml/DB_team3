<template>
  <div class="container">
    <!-- Notice Section -->
    <div class="notice-section">
      <div class="section-header">
        <h2 class="section-title">【 공지 】</h2>
        <button @click="$router.push({ name: 'WritePost' })">글쓰기</button>
      </div>
      <div class="notice-list">
        <div class="notice-item" v-for="(notice, index) in paginatedNotices" :key="index">
          <div class="notice-title">
            <a href="#" @click.prevent="goToViewNotice(notice)">{{ notice.Title }}</a>
          </div>
          <div class="notice-author">{{ notice.Uid }}</div>
          <div class="notice-time">({{ notice.Reg_Date }})</div>
        </div>
      </div>
    </div>

    <!-- Bulletin Board Section -->
    <div class="bulletin-section">
      <div class="section-header">
        <h2 class="section-title">【 게시판 】</h2>
        <button @click="$router.push({ name: 'WritePost' })">글쓰기</button>
      </div>
      <div class="bulletin-list">
        <div class="bulletin-item" v-for="(post, index) in paginatedPosts" :key="index">
          <div class="bulletin-title">
            <a href="#" @click.prevent="goToViewPost(post)">{{ post.Title }}</a>
          </div>
          <div class="bulletin-author">{{ post.Uid }}</div>
          <div class="bulletin-time">({{ post.Reg_Date }})</div>
        </div>
      </div>
    </div>

    <!-- Unified Pagination -->
    <div class="pagination">
      <p>페이지 {{ currentPage }} / {{ totalPages }}</p>
      <button class="pagination-button" @click="prevPage" :disabled="currentPage === 1">이전 페이지</button>
      <button class="pagination-button" @click="nextPage" :disabled="currentPage === totalPages">다음 페이지</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["page"], // URL에서 전달받은 페이지 번호
  data() {
    return {
      posts: [], // 실제 게시글 데이터를 저장
      itemsPerPage: 1, // 페이지당 게시물 수 설정
    };
  },
  computed: {
    currentPage() {
      return parseInt(this.page) || 1;
    },
    totalPages() {
      const noticePages = Math.ceil(this.notices.length / 3);
      const postPages = Math.ceil(this.posts.length / 9);
      return Math.max(noticePages, postPages);
    },
    notices() {
      // Notice 값을 문자열로 변환하여 필터링
      return this.posts.filter(post => String(post.Notice) === "1");
    },
    paginatedNotices() {
      const start = (this.currentPage - 1) * 3;
      const end = start + 3;
      return this.notices.slice(start, end);
    },
    generalPosts() {
      // Notice 값이 0인 게시글 필터링
      return this.posts.filter(post => String(post.Notice) === "0");
    },
    paginatedPosts() {
      const start = (this.currentPage - 1) * 9;
      const end = start + 9;
      return this.generalPosts.slice(start, end);
    },
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await axios.get("http://localhost:3000/boardpage");
        console.log("Fetched posts:", response.data); // 데이터를 확인하기 위한 출력
        this.posts = response.data;
      } catch (error) {
        console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.$router.push({ name: "board", params: { page: this.currentPage + 1 } });
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.$router.push({ name: "board", params: { page: this.currentPage - 1 } });
      }
    },
    goToViewNotice(notice) {
      this.$router.push({
        name: "ViewPost",
        query: { type: "notice", ...notice, page: this.currentPage },
      });
    },
    goToViewPost(post) {
      this.$router.push({
        name: "ViewPost",
        query: { type: "post", ...post, page: this.currentPage },
      });
    },
  },
  created() {
    this.fetchPosts(); // 컴포넌트 생성 시 게시물 데이터 로드
  },
};
</script>

<style scoped>
.container {
  width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.notice-section,
.bulletin-section {
  border-style: solid;
  border-color: black;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
}

.notice-list,
.bulletin-list {
  margin-top: 10px;
}

.notice-item,
.bulletin-item {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}

.notice-title,
.bulletin-title {
  font-weight: bold;
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
