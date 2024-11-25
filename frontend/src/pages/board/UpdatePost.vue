<template>
  <div class="form-container">
    <h2 class="form-title">게시글 수정</h2>
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
    <!-- 이미지 업로드 -->
    <div class="form-group row">
      <label for="photos">이미지 업로드</label>
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
          <div v-else-if="originalImage">
            <img
              :src="originalImage"
              alt="기존 이미지"
              class="preview-image"
            />
            <button @click="handleFileDelete">삭제</button>
          </div>
        </div>
      </div>
    </div>
    <!-- 수정 버튼 -->
    <div class="form-actions">
      <button class="update" @click="updatePost">수정하기</button>
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
        id: "", // 게시글 ID
        Title: "",
        Uid: "",
        Content: "",
        Notice: "0",
        Image: null, // 이미지 상태
      },
      photos: [], // 새로 업로드된 이미지
      previews: [], // 새로 업로드된 이미지의 미리보기 URL
      originalImage: null, // 기존 이미지 식별자
    };
  },
  created() {
    const query = this.$route.query;

    // 전달받은 데이터를 초기화
    this.form.Title = query.title || "";
    this.form.Uid = query.uid || "";
    this.form.Content = query.content || "";
    this.originalImage = query.images.length ? query.images[0] : null;

    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = jwtDecode(token);
        if (user.userID !== this.form.Uid) {
          alert("작성자만 게시글을 수정할 수 있습니다.");
          this.$router.push("/board/page_1");
        }
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
        this.originalImage = null; // 새 이미지를 업로드하면 기존 이미지를 제거
        this.form.Image = null; // 새 이미지를 업로드하므로 삭제 상태 초기화
      } else {
        alert("이미지만 업로드할 수 있습니다.");
      }
    },
    handleFileDelete() {
    this.photos = [];
    this.previews = [];
    this.originalImage = null;
    this.form.Image = "delete"; // 명시적으로 삭제 표시
},
    async updatePost() {
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

      try {
        const formData = new FormData();
        formData.append("Uid", this.form.Uid); // 작성자
        formData.append("Reg_date", this.$route.query.regDate); // 기존 작성 시간
        formData.append("Title", this.form.Title); // 수정된 제목
        formData.append("Content", this.form.Content); // 수정된 내용
        formData.append("New_Reg_date", this.form.Reg_Date); // 새로운 작성 시간

        // 이미지 처리
        if (this.photos.length > 0) {
          // 새로 업로드된 이미지가 있으면 추가
          formData.append("Image", this.photos[0]);
        } else if (this.form.Image === "delete") {
          // 이미지 삭제 요청
          formData.append("Image", "delete");
        } else if (this.originalImage) {
          // 기존 이미지를 유지
          formData.append("Image", "original");
        } else {
          // 이미지가 없으면 null로 처리
          formData.append("Image", null);
        }

        await axios.put("http://localhost:3000/updatepost", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("게시글이 성공적으로 수정되었습니다.");

        // 수정된 게시글로 이동
        this.$router.push({
          name: "ViewPost",
          query: {
            uid: this.form.Uid,
            regDate: this.form.Reg_Date, // 새로운 작성 시간으로 이동
          },
        });
      } catch (error) {
        console.error("게시글 수정 오류:", error.response?.data);
        alert(error.response?.data?.error || "게시글 수정 중 오류가 발생했습니다.");
      }
    },
  },
};
</script>




<style scoped>
/* 스타일은 WritePost와 동일하게 유지 */
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

.update {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.delete {
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.update:hover {
  background-color: #218838;
}

.delete:hover {
  background-color: #c82333;
}
</style>