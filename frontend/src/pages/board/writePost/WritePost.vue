<template>
  <div class="form-container">
    <h2 class="form-title">게시판 글쓰기</h2>
    <!-- 제목 입력 -->
    <div class="form-group row">
      <label for="title">제목</label>
      <input type="text" id="title" placeholder="제목을 입력하세요." v-model="title" />
    </div>

    <!-- 내용 입력 -->
    <div class="form-group row">
      <label for="content">내용</label>
      <textarea id="content" placeholder="게시글의 내용을 적어주세요." v-model="content"></textarea>
    </div>

    <!-- 이미지 업로드 -->
    <div class="form-group row">
      <label for="photos">이미지 업로드</label>
      <div class="photo-upload">
        <input type="file" id="photos" accept="image/*" multiple @change="handleFileUpload" ref="fileInput" style="display: none;" />
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
export default {
  data() {
    return {
      title: '',
      content: '',
      photos: [], // 파일 객체만 저장
      previews: [], // 미리보기 URL만 저장
      maxPhotos: 3, // 최대 업로드 가능 개수
    };
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      const validFiles = files.filter(file => file.type.startsWith('image/'));

      const availableSlots = this.maxPhotos - this.photos.length;
      if (validFiles.length > availableSlots) {
        alert(`이미지는 최대 ${this.maxPhotos}장까지 업로드 가능합니다.`);
        return;
      }

      validFiles.slice(0, availableSlots).forEach(file => {
        const preview = URL.createObjectURL(file);
        this.photos.push(file); // 파일 객체만 저장
        this.previews.push(preview); // 미리보기 URL만 저장
      });
    },
    handleFileDelete(index) {
      URL.revokeObjectURL(this.previews[index]); // 미리보기 URL 해제
      this.photos.splice(index, 1); // 파일 삭제
      this.previews.splice(index, 1); // 미리보기 URL 삭제
    },
    submitForm() {
      if (!this.title.trim()) {
        alert('제목을 입력해주세요.');
        return;
      }
      if (!this.content.trim()) {
        alert('내용을 입력해주세요.');
        return;
      }

      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('content', this.content);
      this.photos.forEach((file, index) => {
        formData.append(`photo${index + 1}`, file);
      });

      console.log('Form Data:', {
        title: this.title,
        content: this.content,
        photos: this.photos,
      });

      this.resetForm();
    },
    resetForm() {
      this.title = '';
      this.content = '';
      this.photos = [];
      this.previews.forEach(preview => URL.revokeObjectURL(preview));
      this.previews = [];
    },
  },
};
</script>

<style scoped>
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
