<template>
  <div class="container">
    <!-- 공지사항 -->
    <div class="notice-section">
      <div class="section-header">
        <h2 class="section-title">【 공지 】</h2>
        <button v-if="isAuthorized" @click="goToWritePost(1)">공지쓰기</button>
        <button v-else @click="showPermissionAlert">공지쓰기</button>
      </div>
      <div class="notice-list">
        <div class="notice-item" v-for="(notice, index) in paginatedNotices" :key="index">
          <div class="notice-title">
            <a href="#" @click.prevent="goToViewNotice(notice)">{{ notice.Title }}</a>
          </div>
          <div class="notice-author">{{ notice.Uid }}</div>
          <div class="notice-time">({{ formatDate(notice.Reg_Date) }})</div>
        </div>
      </div>
    </div>
    <!-- 게시판 -->
    <div class="bulletin-section">
      <div class="section-header">
        <h2 class="section-title">【 게시판 】</h2>
        <button @click="goToWritePost(0)">글쓰기</button>
      </div>
      <div class="bulletin-list">
        <div class="bulletin-item" v-for="(post, index) in paginatedPosts" :key="index">
          <div class="bulletin-title">
            <a href="#" @click.prevent="goToViewPost(post)">{{ post.Title }}</a>
          </div>
          <div class="bulletin-author">{{ post.Uid }}</div>
          <div class="bulletin-time" v-if="post.Reg_date">({{ formatDate(post.Reg_Date) }})</div>
        </div>
      </div>
    </div>
    <!-- 페이지네이션 -->
    <div class="pagination">
      <p>페이지 {{ currentPage }} / {{ totalPages }}</p>
      <button class="pagination-button" @click="prevPage" :disabled="currentPage === 1">이전 페이지</button>
      <button class="pagination-button" @click="nextPage" :disabled="currentPage === totalPages">다음 페이지</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default {
  props: ["page"],
  data() {
    return {
      posts: [],
      itemsPerPage: 1,
      isAuthorized: false, // 공지쓰기 권한 여부 상태
    };
  },
  computed: {
    currentPage() {
      return parseInt(this.page) || 1;
    },
    totalPages() {
      const noticePages = Math.ceil(this.notices.length / 3) || 0;
      const postPages = Math.ceil(this.posts.length / 9) || 0;
      return Math.max(Math.max(noticePages, postPages), 1);
    },
    notices() {
      return this.posts.filter(post => String(post.Notice) === "1");
    },
    paginatedNotices() {
      const start = (this.currentPage - 1) * 3;
      const end = start + 3;
      return this.notices.slice(start, end);
    },
    generalPosts() {
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
        this.posts = response.data.map(post => ({
          ...post,
          Reg_Date: post.Reg_date,
        }));
      } catch (error) {
        console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
      }
    },
    formatDate(dateString) {
      console.log("date:");
      console.log(dateString);
      console.log(typeof(dateString));
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
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
    goToViewNotice(post) {
      this.$router.push({
        name: "ViewPost",
        query: {
          uid: post.Uid, // `uid`로 전달
          regDate: post.Reg_Date, // 정확한 날짜 필드
          page: this.currentPage,
        },
      });
    },
    goToViewPost(post) {
      this.$router.push({
        name: "ViewPost",
        query: {
          uid: post.Uid, // `uid`로 전달
          regDate: post.Reg_Date, // 정확한 날짜 필드
          page: this.currentPage,
        },
      });
    },
    goToWritePost(noticeValue) {
      this.$router.push({
        name: "WritePost",
        query: { Notice: noticeValue },
      });
    },
    showPermissionAlert() {
      alert("공지 쓰기 권한이 없습니다.");
    },
    checkUserAuth() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const user = jwtDecode(token);
          this.isAuthorized = user.auth === 1; // Auth 값으로 권한 확인
        } catch (error) {
          console.error("JWT 디코딩 오류:", error);
          this.isAuthorized = false;
        }
      } else {
        this.isAuthorized = false;
      }
    },
  },
  created() {
    this.fetchPosts();
    this.checkUserAuth(); // 사용자 권한 확인
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
