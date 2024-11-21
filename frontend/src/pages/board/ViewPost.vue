<template>
  <div class="view-post-container">
    <!-- 게시글 정보 -->
    <div class="post-info">
      <div class="post-title-meta">
        <div class="post-title">{{ post.Title }}</div>
        <div class="post-meta">
          {{ post.Uid }} <br />
          {{ formatDate(post.Reg_date) }}
        </div>
      </div>
      <!-- 본문 내용 -->
      <div class="post-content">
        {{ post.Content }}
      </div>
      <!-- 이미지 -->
      <div class="post-image-container">
        <div v-if="post.Image && typeof post.Image === 'string'">
          <img
            :src="`data:image/jpeg;base64,${post.Image}`"
            alt="첨부 이미지"
            class="post-image"
          />
        </div>
      </div>
    </div>

    <!-- 버튼 섹션 -->
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
  width: 960px;
  margin: 20px auto;
  padding: 20px;
  border-style: solid;
  border-color: black;
  border-radius: 10px;
  background-color: #fff;
}

/* 게시글 제목과 작성자/작성일 */
.post-title-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.post-title {
  font-size: 24px;
  font-weight: bold;
  text-align: left; /* 좌측 정렬 */
}

.post-meta {
  text-align: right; /* 작성자/작성일 우측 정렬 */
  font-size: 14px;
  color: black; /* 검정 글씨로 변경 */
  line-height: 1.5;
}

/* 본문 내용 */
.post-content {
  border: 1px solid #000;
  padding: 20px;
  margin-top: 20px;
  font-size: 16px;
  line-height: 1.6;
  overflow-wrap: break-word; /* 긴 단어를 줄 바꿈 */
  background-color: #fff; /* 배경색을 하얀색으로 변경 */
  min-height: 150px; /* 최소 높이 설정 */
  text-align: left; /* 좌측 정렬 */
}

/* 이미지 섹션 */
.post-image-container {
  margin-top: 20px;
  text-align: center;
}

.post-image {
  max-width: 100%;
  max-height: 300px; /* 최대 높이 제한 */
  object-fit: contain; /* 이미지 비율 유지 */
  border: 1px solid #ddd;
  border-radius: 5px;
  margin: 10px 0;
}

/* 이미지가 없을 때 */
.no-image {
  font-size: 14px;
  color: gray;
  margin-top: 20px;
}

/* 버튼 섹션 */
.button-container {
  display: flex;
  justify-content: flex-end; /* 버튼 오른쪽 정렬 */
  gap: 10px; /* 버튼 간격 */
  margin-top: 20px;
}

.back-button {
  padding: 10px 20px;
  font-size: 14px;
  border: 1px solid black;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  background-color: #007bff;
  transition: background-color 0.3s;
}
.edit-button {
  padding: 10px 20px;
  font-size: 14px;
  border: 1px solid black;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  background-color: green;
  transition: background-color 0.3s;
}
.back-button:hover {
  background-color: blue;
}

.edit-button:hover {
  background-color: darkgreen;
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

.delete-button:hover {
  background-color: darkred;
}
</style>

