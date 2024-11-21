<template>
  <div class="form-container">
    <h2 class="form-title">게시글 작성</h2>
    <!-- 제목 입력 -->
    <div class="form-group row">
      <label for="title">제목</label>
      <input type="text" id="title" v-model="form.Title" placeholder="제목을 입력하세요." />
    </div>
    <!-- 작성자 -->
    <div class="form-group row">
      <label for="author">작성자</label>
      <input type="text" id="author" v-model="form.Uid" disabled />
    </div>
    <!-- 내용 입력 -->
    <div class="form-group row">
      <label for="content">내용</label>
      <textarea id="content" v-model="form.Content" placeholder="내용을 입력하세요."></textarea>
    </div>
    <!-- 공지 설정 (관리자만 표시) -->
    <div class="form-group row" v-if="isAdmin">
      <label for="notice">공지 설정</label>
      <input type="checkbox" id="notice" v-model="form.Notice" />
    </div>
    <!-- 이미지 업로드 -->
    <div class="form-group row">
      <label for="photos">이미지</label>
      <div class="photo-upload">
        <input
          type="file"
          id="photos"
          accept="image/*"
          @change="handleFileUpload"
          ref="fileInput"
          style="display: none;"
        />
        <button @click="triggerFileInput">이미지 선택</button>
        <div class="photo-previews">
          <img
            v-if="previews.length"
            :src="previews[0]"
            alt="미리보기 이미지"
            class="preview-image"
          />
          <button v-if="previews.length" @click="handleFileDelete">삭제</button>
        </div>
      </div>
    </div>
    <!-- 작성 버튼 -->
    <div class="form-actions">
      <button class="submit" @click="submitPost">작성하기</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default {
  data() {
    return {
      form: {
        Title: "",
        Uid: "",
        Content: "",
        Notice: false, // 체크박스 상태 (기본값: false)
      },
      photos: [], // 업로드된 이미지
      previews: [], // 이미지 미리보기 URL
      isAdmin: false, // 로그인 사용자가 관리자(auth === 1)인지 여부
    };
  },
  created() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = jwtDecode(token);
        this.form.Uid = user.userID;
        this.isAdmin = user.auth === 1; // 관리자 여부 확인
      } catch (error) {
        console.error("JWT 디코딩 오류:", error);
        alert("로그인 정보가 유효하지 않습니다.");
        this.$router.push("/login");
      }
    } else {
      alert("로그인이 필요합니다.");
      this.$router.push("/login");
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        this.photos = [file];
        this.previews = [URL.createObjectURL(file)];
      } else {
        alert("이미지만 업로드할 수 있습니다.");
      }
    },
    handleFileDelete() {
      this.photos = [];
      this.previews = [];
    },
    async submitPost() {
      if (!this.form.Title.trim() || !this.form.Content.trim()) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
      }const now = new Date();
  this.form.Reg_Date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
    now.getSeconds()
  ).padStart(2, "0")}`;
      try {
        const formData = new FormData();
        formData.append("Title", this.form.Title);
        formData.append("Uid", this.form.Uid);
        formData.append("Content", this.form.Content);
        formData.append("Notice", this.form.Notice ? "1" : "0"); // 공지 여부 설정
        formData.append("Reg_date", this.form.Reg_Date);
        if (this.photos.length > 0) {
          formData.append("Image", this.photos[0]);
        }
        console.log("Reg_DATE", this.form.Reg_Date);
        const response = await axios.post("http://localhost:3000/writepost", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("서버 응답:", response.data);
        alert("게시글이 성공적으로 작성되었습니다.");
        this.$router.push("/board/page_1");
      } catch (error) {
        console.error("게시글 작성 오류:", error.response?.data);
        alert(error.response?.data?.error || "게시글 작성 중 오류가 발생했습니다.");
      }
    },
  },
};
</script>

<style scoped>
/* 스타일은 기존과 동일 */
.form-container {
  width: 950px;
  margin: 0 auto;
  padding: 20px;
  border-style: solid;
  border-color: black;
  border-radius: 10px;
  font-family: Arial, sans-serif;
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #ccc;
  padding: 10px 0;
}

label {
  font-weight: bold;
  flex: 0 0 80px;
}

input[type="text"],
textarea {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: Arial, sans-serif;
  margin-left: 20px;
}

textarea {
  height: 150px;
}

.photo-upload {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.photo-previews {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.form-actions {
  text-align: right;
  margin-top: 20px;
}

.submit {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit:hover {
  background-color: #218838;
}
</style>
