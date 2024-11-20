<template>
  <div class="form-container">
    <h2 class="form-title">게시판 글쓰기</h2>
    <!-- 제목 입력 -->
    <div class="form-group row">
      <label for="title">제목</label>
      <input type="text" id="title" placeholder="제목을 입력하세요." v-model="form.Title" />
    </div>

    <!-- 내용 입력 -->
    <div class="form-group row">
      <label for="content">내용</label>
      <textarea id="content" placeholder="게시글의 내용을 적어주세요." v-model="form.Content"></textarea>
    </div>

    <!-- 이미지 업로드 -->
    <div class="form-group row">
      <label for="photos">이미지 업로드</label>
      <div class="photo-upload">
        <input type="file" id="photos" accept="image/*" @change="handleFileUpload" ref="fileInput"
          style="display: none;" />
        <button type="button" @click="triggerFileInput">첨부할 이미지를 선택해주세요.</button>
        <div class="photo-previews">
          <div v-for="(preview, index) in previews" :key="index" class="photo-item">
            <img :src="preview" alt="미리보기 이미지" class="preview-image" />
            <button type="button" @click="handleFileDelete(index)">삭제</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 등록 버튼 -->
    <div class="form-actions">
      <button class="register" @click="submitForm">등록하기</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // 추가: JWT 디코더

export default {
  data() {
    return {
      form: {
        Uid: "", // 로그인 사용자 ID를 저장할 필드
        Title: "",
        Content: "",
        Notice: "0",
        Reg_Date: "",
      },
      photos: [],
      previews: [],
    };
  },
  mounted() {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = jwtDecode(token);
        console.log("Decoded User:", user); // 디코딩된 사용자 정보 확인
        this.form.Uid = user.userID; // userID를 Uid로 설정
      } catch (error) {
        console.error("JWT 디코딩 오류:", error);
        alert("로그인 정보가 유효하지 않습니다. 다시 로그인하세요.");
        this.$router.push("/login"); // 로그인 페이지로 이동
      }
    } else {
      alert("로그인이 필요합니다.");
      this.$router.push("/login"); // 로그인 페이지로 이동
    }

    if (this.$route.query.Notice) {
      this.form.Notice = this.$route.query.Notice;
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
    handleFileDelete(index) {
      URL.revokeObjectURL(this.previews[index]);
      this.photos = [];
      this.previews = [];
    },
    async submitForm() {
      if (!this.form.Title.trim() || !this.form.Content.trim()) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
      }

      const now = new Date();
      this.form.Reg_Date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
        now.getSeconds()
      ).padStart(2, "0")}`;

      const formData = new FormData();
      formData.append("Uid", this.form.Uid);
      formData.append("Title", this.form.Title);
      formData.append("Content", this.form.Content);
      formData.append("Notice", this.form.Notice);
      formData.append("Reg_Date", this.form.Reg_Date);

      if (this.photos.length > 0) {
        formData.append("Image", this.photos[0]);
      }

      try {
        await axios.post("http://localhost:3000/writepost", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("게시글이 성공적으로 등록되었습니다.");
        this.$router.push("/board/page_1");
      } catch (error) {
        console.error("게시글 등록 중 오류:", error);
        alert("게시글 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    },
  },
};
</script>

<style scoped>
/* 기존 스타일 그대로 유지 */
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

input[type='text'],
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

.photo-item {
  position: relative;
  display: inline-block;
}

.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.photo-item button {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 2px 6px;
  border: none;
  background-color: #dc3545;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 10px;
}

.form-actions {
  text-align: right;
  margin-top: 20px;
}

.register {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
