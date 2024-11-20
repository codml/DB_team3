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
        </div>
      </div>
    </div>
    <!-- 수정/삭제 버튼 -->
    <div class="form-actions">
      <button class="update" @click="updatePost">수정하기</button>
      <button class="delete" @click="deletePost">삭제하기</button>
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
      },
      photos: [],
      previews: [],
    };
  },
  created() {
    const query = this.$route.query;
    this.form.id = query.id || "";
    this.form.Title = query.title || "";
    this.form.Uid = query.author || "";
    this.form.Content = query.content || "";
    this.previews = query.images || [];

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
      } else {
        alert("이미지만 업로드할 수 있습니다.");
      }
    },
    handleFileDelete() {
      this.photos = [];
      this.previews = [];
    },
   // UpdatePost.vue의 updatePost 메서드 수정
async updatePost() {
  if (!this.form.Title.trim() || !this.form.Content.trim()) {
    alert("제목과 내용을 모두 입력해주세요.");
    return;
  }

  const now = new Date();
  const updatedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
    now.getHours()
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

  try {
    const formData = new FormData();
    formData.append("Title", this.form.Title);
    formData.append("Uid", this.form.Uid);
    formData.append("Content", this.form.Content);
    formData.append("Reg_Date", updatedTime);
    formData.append("id", this.$route.query.id); // 게시글 ID 추가

    if (this.photos.length > 0) {
      formData.append("Image", this.photos[0]);
    }

    console.log("전송할 데이터:", {
      Title: this.form.Title,
      Uid: this.form.Uid,
      Content: this.form.Content,
      Reg_Date: updatedTime,
      id: this.$route.query.id,
      hasImage: this.photos.length > 0
    });

    const response = await axios.put("http://localhost:3000/updatepost", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("서버 응답:", response.data);
    alert("게시글이 성공적으로 수정되었습니다.");
    this.$router.push("/board/page_1");
  } catch (error) {
    console.error("게시글 수정 오류:", error);
    console.error("오류 응답:", error.response?.data);
    alert(error.response?.data?.error || "게시글 수정 중 오류가 발생했습니다.");
  }
},
    async deletePost() {
      if (confirm("정말 삭제하시겠습니까?")) {
        try {
          await axios.delete("http://localhost:3000/deletepost", {
            data: { id: this.form.id },
          });
          alert("게시글이 삭제되었습니다.");
          this.$router.push("/board/page_1");
        } catch (error) {
          console.error("게시글 삭제 오류:", error);
          alert("삭제 중 오류가 발생했습니다.");
        }
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