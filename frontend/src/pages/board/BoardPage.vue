<template>
  <div class="container">
    <div class="post-section">
      <div class="section-header">
        <h2 class="section-title">자유게시판</h2>
        <button @click="goToWritePost">글쓰기</button>
      </div>
      <!-- Table for posts -->
      <table class="post-table">
        <thead>
          <tr>
            <th class="title-column">제목</th>
            <th class="author-column">작성자</th>
            <th class="date-column">작성일</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(post, index) in paginatedPosts"
            :key="index"
            :class="{ notice: post.Notice === 1 || post.Notice === '1' }"
          >
            <td class="post-title">
              <a href="#" @click.prevent="goToViewPost(post)">
                <span v-if="post.Notice === 1 || post.Notice === '1'" class="notice-badge">공지</span>
                {{ post.Title }}
              </a>
              <span v-if="post.CommentCount" class="comment-count">
                [{{ post.CommentCount }}]
              </span>
            </td>
            <td class="post-author">{{ post.Uid }}</td>
            <td class="post-time">{{ formatDate(post.Reg_Date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <p>페이지 {{ currentPage }} / {{ totalPages }}</p>
      <button
        class="pagination-button"
        @click="prevPage"
        :disabled="currentPage === 1"
      >
        이전 페이지
      </button>
      <button
        class="pagination-button"
        @click="nextPage"
        :disabled="currentPage === totalPages"
      >
        다음 페이지
      </button>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  props: ["page"],
  data() {
    return {
      posts: [], // 전체 게시글
      itemsPerPage: 10, // 페이지당 항목 수
    };
  },
  computed: {
    currentPage() {
      return parseInt(this.page) || 1;
    },
    totalPages() {
      return Math.ceil(this.sortedPosts.length / this.itemsPerPage) || 1;
    },
    sortedPosts() {
      return [...this.posts].sort((a, b) => {
        // Notice 값을 숫자로 비교
        if (a.Notice === 1 && b.Notice === 0) return -1;
        if (a.Notice === 0 && b.Notice === 1) return 1;
        return new Date(b.Reg_date) - new Date(a.Reg_date);
      });
    },
    paginatedPosts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedPosts.slice(start, end);
    },
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await axios.get("http://localhost:3000/boardpage");
        console.log("Fetched posts:", response.data);
        this.posts = response.data.map((post) => ({
          ...post,
          Notice: post.Notice, // Notice 값 유지
          Reg_Date: post.Reg_date, // Reg_Date 매핑
        }));
        console.log("Processed posts:", this.posts); // 변환 후 데이터 확인
      } catch (error) {
        console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")} ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.$router.push({
          name: "board",
          params: { page: this.currentPage + 1 },
        });
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.$router.push({
          name: "board",
          params: { page: this.currentPage - 1 },
        });
      }
    },
    goToViewPost(post) {
      this.$router.push({
        name: "ViewPost",
        query: {
          uid: post.Uid,
          regDate: post.Reg_Date,
          page: this.currentPage,
        },
      });
    },
    goToWritePost() {
      this.$router.push({ name: "WritePost" });
    },
  },
  created() {
    this.fetchPosts();
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

.post-section {
  border-style: solid;
  border-color: black;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between; /* 좌우 정렬 */
  align-items: center;
  margin-bottom: 15px;
}

button {
  font-size: 16px; /* 버튼 글씨 크기 */
  padding: 10px 20px; /* 버튼 크기 조정 */
  background-color: #007bff; /* 버튼 배경색 */
  color: white; /* 버튼 글씨색 */
  border: none; /* 테두리 제거 */
  border-radius: 4px; /* 둥근 모서리 */
  cursor: pointer; /* 커서 변경 */
}

button:hover {
  background-color: #0056b3; /* 호버 시 색상 변경 */
}

.section-title {
  font-size: 40px;
  font-weight: bold;
}

.post-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.post-table th,
.post-table td {
  border: 1px solid #ccc;
  padding: 10px;
}

.post-table th.title-column {
  width: 60%; /* 제목 칸 */
}

.post-table th.author-column {
  width: 20%; /* 작성자 칸 */
  text-align: right; /* 오른쪽 정렬 */
}

.post-table th.date-column {
  width: 20%; /* 작성일 칸 */
  text-align: right; /* 오른쪽 정렬 */
}

.post-table td.post-title {
  text-align: left;
}

.post-table td.post-author {
  text-align: right; /* 작성자 데이터 오른쪽 정렬 */
}

.post-table td.post-time {
  text-align: right; /* 작성일 데이터 오른쪽 정렬 */
}

.post-table tr {
  transition: background-color 0.3s ease;
}

.post-table tr:hover {
  background-color: #f1f1f1; /* 호버 시 더 밝은 색상 */
}

.post-table tr.notice {
  font-weight: bold; /* 공지사항 굵은 글씨 */
  background-color: #f9f9f9; /* 공지사항 배경색 */
}

.post-table tr.notice td {
  font-weight: bold; /* 공지사항의 모든 열 굵게 */
  color: #333; /* 텍스트 색상 */
}

.post-title a {
  text-decoration: none; /* 제목 밑줄 제거 */
  color: black; /* 제목 색상 검정으로 설정 */
  cursor: pointer;
}

.post-title a:hover {
  text-decoration: underline; /* 제목에 마우스 호버 시 밑줄 추가 */
}

.notice-badge {
  color: red;
  font-weight: bold;
  margin-right: 5px;
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

.pagination-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
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

.pagination-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
</style>
