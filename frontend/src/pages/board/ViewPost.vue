<template>
  <div class="view-post-container">
    <h2>게시글 보기</h2>

    <!-- 게시글 정보 섹션 -->
    <div class="post-info">
      <div class="post-title">
        <strong>{{ post.Title }}</strong>
      </div>
      <div class="post-meta">
        <span class="post-author">작성자: {{ post.Uid }}</span>
        <span class="post-time">작성 시간: {{ formatDate(post.Reg_date) }}</span>
      </div>
      <div class="post-content">
        <p>{{ post.Content }}</p>
      </div>
    </div>

    <!-- 이미지 섹션 -->
    <div class="post-image-container">
      <div v-if="post.Image && typeof post.Image === 'string'">
        <!-- 이미지 렌더링 -->
        <img
          :src="`data:image/jpeg;base64,${post.Image}`"
          alt="첨부 이미지"
          class="post-image"
        />
      </div>
      <div v-else>
        <p class="no-image"></p>
      </div>
    </div>

    <!-- 버튼 -->
    <div class="button-container">
      <button class="back-button" @click="goBack">목록으로</button>
      <button
        class="delete-button"
        v-if="canDeletePost || isAdmin"
        @click="confirmDeletePost"
      >
        삭제하기
      </button>
      <button
        class="edit-button"
        v-if="canEditPost"
        @click="goToUpdatePost"
      >
        수정하기
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default {
  name: "ViewPost",
  data() {
    return {
      post: {
        Title: "",
        Uid: "",
        Reg_date: "",
        Content: "",
        Image: null, // 이미지 추가
      },
      id: null,
      auth: null, // 사용자 Auth 정보
      previousPage: 1,
    };
  },
  computed: {
    canDeletePost() {
      return this.id === this.post.Uid;
    },
    canEditPost() {
      return this.id === this.post.Uid;
    },
    isAdmin() {
      return this.auth === 1;
    },
  },
  async created() {
    const query = this.$route.query;

    if (!query.uid || !query.regDate) {
      alert("잘못된 요청입니다.");
      this.goBack();
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = jwtDecode(token);
        this.id = user.userID;
        this.auth = user.auth; // Auth 정보 저장
      } catch (error) {
        console.error("JWT 디코딩 오류:", error);
        this.$router.push("/login");
        return;
      }
    } else {
      alert("로그인이 필요합니다.");
      this.$router.push("/login");
      return;
    }

    try {
      const response = await axios.get("http://localhost:3000/viewpost", {
        params: {
          uid: query.uid,
          regDate: query.regDate,
        },
      });
      this.post = response.data;
    } catch (error) {
      console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
      alert("게시글 정보를 불러오는 데 실패했습니다.");
      this.goBack();
    }
  },
  methods: {
    goBack() {
      this.$router.push({ name: "board", params: { page: this.previousPage } });
    },
    goToUpdatePost() {
      console.log("수정하기 버튼 클릭");
      this.$router.push({
        name: "UpdatePost",
        query: {
          uid: this.post.Uid,
          regDate: this.post.Reg_date,
          title: this.post.Title,
          content: this.post.Content,
          images: this.post.Image ? [`data:image/jpeg;base64,${this.post.Image}`] : [],
        },
      });
    },
    confirmDeletePost() {
      if (confirm("정말로 삭제하시겠습니까?")) {
        this.deletePost();
      }
    },
    async deletePost() {
      try {
        console.log("UID delete:", this.post.Uid);
        console.log("UID Reg Date:", this.post.Reg_date);

        await axios.delete("http://localhost:3000/deletepost", {
          data: {
            uid: this.post.Uid,
            regDate: this.post.Reg_date,
          },
        });

        alert("게시글이 삭제되었습니다.");
        this.goBack();
      } catch (error) {
        console.error("게시글 삭제 중 오류 발생:", error);
        alert("게시글 삭제에 실패했습니다.");
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")} ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(
        2,
        "0"
      )}:${String(date.getSeconds()).padStart(2, "0")}`;
    },
  },
};
</script>




<style scoped>
.view-post-container {
  width: 963px;
  margin: 20px auto;
  padding: 20px;
  border-style: solid;
  border-color: black;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

/* 게시글 정보 섹션 스타일 */
.post-info {
  margin-bottom: 20px;
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
}

.post-content {
  border: 1px solid #000;
  padding: 20px;
  height: 300px;
  overflow-y: auto;
  font-size: 16px;
  line-height: 1.5;
}

/* 이미지 섹션 스타일 */
.post-image-container {
  margin-top: 20px;
  text-align: center;
}

.post-image {
  max-width: 100%;
  max-height: 500px; /* 최대 높이를 제한 */
  object-fit: contain; /* 이미지가 잘리지 않도록 조절 */
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.no-image {
  font-size: 14px;
  color: gray;
}

/* 버튼 섹션 스타일 */
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
.delete-button {
  color: white;
  background-color: red;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button {
  color: white;
  background-color: green;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  margin-left: 0%;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: darkred;
}

.edit-button:hover {
  background-color: darkgreen;
}
</style>
