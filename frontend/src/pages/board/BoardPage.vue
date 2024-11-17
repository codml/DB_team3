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
            <a href="#" @click.prevent="goToViewNotice(notice)">{{ notice.title }}</a>
          </div>
          <div class="notice-author">{{ notice.author }}</div>
          <div class="notice-time">({{ notice.time }})</div>
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
            <a href="#" @click.prevent="goToViewPost(post)">{{ post.title }}</a>
          </div>
          <div class="bulletin-author">{{ post.author }}</div>
          <div class="bulletin-time">({{ post.time }})</div>
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
export default {
  props: ['page'], // URL에서 전달받은 페이지 번호
  data() {
    return {
      notices: Array.from({ length: 20 }, (_, i) => ({
        title: `공지 제목 ${i + 1}`,
        author: '관리자',
        time: `2024-11-${30 - i}`,
        content: `공지 ${i + 1}의 내용입니다.`,
      })),
      posts: Array.from({ length: 40 }, (_, i) => ({
        title: `게시글 제목 ${i + 1}`,
        author: `사용자${i + 1}`,
        time: `2024-11-${30 - i}`,
        content: `게시글 ${i + 1}의 내용입니다.`,
      })),
      itemsPerPage: 1,
    };
  },
  computed: {
    currentPage() {
      return parseInt(this.page) || 1;
    },
    totalPages() {
      return Math.max(
        Math.ceil(this.notices.length / 3),
        Math.ceil(this.posts.length / 9)
      );
    },
    paginatedNotices() {
      const start = (this.currentPage - 1) * 3;
      const end = start + 3;
      return this.notices.slice(start, end);
    },
    paginatedPosts() {
      const start = (this.currentPage - 1) * 9;
      const end = start + 9;
      return this.posts.slice(start, end);
    },
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.$router.push({ name: 'board', params: { page: this.currentPage + 1 } });
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.$router.push({ name: 'board', params: { page: this.currentPage - 1 } });
      }
    },
    goToViewNotice(notice) {
      this.$router.push({
        name: 'ViewPost',
        query: { type: 'notice', ...notice, page: this.currentPage },
      });
    },
    goToViewPost(post) {
      this.$router.push({
        name: 'ViewPost',
        query: { type: 'post', ...post, page: this.currentPage },
      });
    },
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
