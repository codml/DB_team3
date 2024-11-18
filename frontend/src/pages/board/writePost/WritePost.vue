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
        <input
          type="file"
          id="photos"
          accept="image/*"
          multiple
          @change="handleFileUpload"
          ref="fileInput"
          style="display: none;"
        />
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
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        Uid: 'userTest', // 사용자 ID (테스트 값)
        Title: '',
        Content: '',
        Notice: '0', // 공지 여부
        Reg_Date: '', // 작성 시간
      },
      photos: [], // 업로드된 파일 객체 배열
      previews: [], // 이미지 미리보기 URL 배열
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
      if (validFiles.length > 1) {
        alert(`이미지는 최대 1장까지 업로드 가능합니다.`);
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
    async submitForm() {
  // 필수 입력 검증
  if (!this.form.Title.trim()) {
    alert('제목을 입력해주세요.');
    return;
  }
  if (!this.form.Content.trim()) {
    alert('내용을 입력해주세요.');
    return;
  }

  // 작성 시간 추가
  const now = new Date();
  this.form.Reg_Date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
    now.getHours()
  ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

  // FormData 객체 생성
  const formData = new FormData();
  formData.append('Uid', this.form.Uid);
  formData.append('Title', this.form.Title);
  formData.append('Content', this.form.Content);
  formData.append('Notice', this.form.Notice);
  formData.append('Reg_Date', this.form.Reg_Date);

  // 단일 이미지 추가 (첫 번째 이미지만 처리)
  if (this.photos.length > 0) {
    formData.append('Image', this.photos[0]); // 이미지 필드 이름을 'Image'로 고정
  }

  // 서버로 전송
  try {
    const response = await axios.post('http://localhost:3000/writepost', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('서버 응답:', response.data);
    alert('게시글이 성공적으로 등록되었습니다.');
    this.$router.push('/board/page_1');
    this.resetForm();
  } catch (error) {
    console.error('게시글 등록 오류:', error);
    alert('게시글 등록 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
},


    resetForm() {
      this.form.Title = '';
      this.form.Content = '';
      this.photos = [];
      this.previews.forEach(preview => URL.revokeObjectURL(preview)); // 모든 미리보기 URL 해제
      this.previews = [];
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
