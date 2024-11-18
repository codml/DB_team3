<template>
    <div class="form-container">
      <h2 class="form-title">게시글 수정</h2>
      <!-- 제목 입력 -->
      <div class="form-group row">
        <label for="title">제목</label>
        <input type="text" id="title" placeholder="제목을 입력하세요." v-model="title" />
      </div>
  
      <!-- 작성자 표시 -->
      <div class="form-group row">
        <label for="author">작성자</label>
        <input type="text" id="author" v-model="author" disabled />
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
  
      <!-- 수정/삭제 버튼 -->
      <div class="form-actions">
        <button class="update" @click="updatePost">수정하기</button>
        <button class="delete" @click="deletePost">삭제하기</button>
      </div>
    </div>
  </template>
  
  <script>
  // axios를 사용하여 서버와 통신 준비
  // 주석 처리된 부분은 서버가 구축되면 활성화
  // import axios from 'axios';
  
  export default {
    data() {
      return {
        title: '',
        author: '', // 작성자 정보
        content: '',
        photos: [], // 파일 객체만 저장
        previews: [], // 미리보기 URL만 저장
        maxPhotos: 3, // 최대 업로드 가능 개수
      };
    },
    created() {
      // ViewPost.vue에서 전달받은 데이터 불러오기
      const query = this.$route.query;
      this.title = query.title || '';
      this.author = query.author || '알 수 없음'; // 작성자는 수정 불가능
      this.content = query.content || '';
      this.previews = query.images || []; // 이미지 URL 배열 초기화
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
      async updatePost() {
        if (!this.title.trim()) {
          alert('제목을 입력해주세요.');
          return;
        }
        if (!this.content.trim()) {
          alert('내용을 입력해주세요.');
          return;
        }
  
        // 작성 시간 갱신 (날짜와 시간 포함)
        const now = new Date();
        const updatedTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(
          now.getHours()
        ).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  
        // FormData 객체로 수정 데이터 준비
        const formData = new FormData();
        formData.append('title', this.title);
        formData.append('author', this.author); // 작성자는 유지
        formData.append('content', this.content);
        formData.append('time', updatedTime); // 수정된 날짜와 시간
        this.photos.forEach((file, index) => {
          formData.append(`photo${index + 1}`, file);
        });
  
        // 서버에 수정 요청 (현재 주석 처리, 대신 console.log 출력)
        /*
        try {
          const response = await axios.put('/api/posts/update', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          alert('게시글이 성공적으로 수정되었습니다.');
          console.log('서버 응답:', response.data);
          this.$router.push({ name: 'ViewPost', query: { title: this.title, content: this.content, author: this.author, time: updatedTime } });
        } catch (error) {
          alert('게시글 수정 중 오류가 발생했습니다.');
          console.error('서버 오류:', error);
        }
        */
  
        console.log('수정된 데이터:', {
          title: this.title,
          author: this.author,
          content: this.content,
          time: updatedTime,
          photos: this.photos,
        });
  
        alert('게시글이 수정되었습니다.');
        this.$router.push({
          name: 'ViewPost',
          query: {
            title: this.title,
            content: this.content,
            author: this.author,
            time: updatedTime,
          },
        });
      },
      async deletePost() {
        if (confirm('정말로 삭제하시겠습니까?')) {
          // 서버에 삭제 요청 (현재 주석 처리, 대신 console.log 출력)
          /*
          try {
            const response = await axios.delete('/api/posts/delete', {
              data: { title: this.title, content: this.content, author: this.author },
            });
            alert('게시글이 성공적으로 삭제되었습니다.');
            console.log('서버 응답:', response.data);
            this.$router.push({ name: 'board', params: { page: 1 } });
          } catch (error) {
            alert('게시글 삭제 중 오류가 발생했습니다.');
            console.error('서버 오류:', error);
          }
          */
  
          console.log('삭제된 데이터:', {
            title: this.title,
            author: this.author,
            content: this.content,
          });
  
          alert('게시글이 삭제되었습니다.');
          this.$router.push({ name: 'board', params: { page: 1 } });
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
  