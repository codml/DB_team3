<template>
  <div class="form-container">
    <div class="form-group row">
      <label for="title">제목</label>
      <input type="text" id="title" placeholder="제목을 입력하세요" v-model="title" />
    </div>

    <div class="form-group row">
      <label for="photos">사진</label>
      <div class="photo-upload">
        <!-- 숨겨진 파일 입력 필드 -->
        <input type="file" id="photos" accept="image/*" multiple @change="handleFileUpload" ref="fileInput" style="display: none;" />
        <!-- 사용자 정의 버튼 -->
        <button type="button" @click="triggerFileInput">파일 선택</button>
        <div class="photo-previews">
  <div v-for="(preview, index) in previews" :key="index" class="photo-item">
    <img :src="preview" alt="미리보기 이미지" class="preview-image" />
    <button type="button" @click="handleFileDelete(index)">삭제</button>
  </div>
</div>

      </div>
    </div>

    <div class="form-group row">
      <label for="price">가격</label>
      <input type="text" id="price" placeholder="가격을 입력하세요" v-model="price" />
    </div>

    <div class="form-group row description-group">
      <label for="description">설명</label>
      <textarea id="description" placeholder="판매하실 상품의 설명을 적어주세요" v-model="description"></textarea>
    </div>

    <div class="form-group row">
      <label>거래 방식</label>
      <div class="trade-options">
        <input type="checkbox" id="direct" v-model="isDirectTrade" />
        <label for="direct">직거래</label>
        <input type="checkbox" id="delivery" v-model="isDeliveryTrade" />
        <label for="delivery">택배거래</label>
      </div>
    </div>

    <div v-if="isDirectTrade" class="form-group row">
      <label for="location">거래희망장소</label>
      <div class="location-select">
        <input type="text" id="location" placeholder="거래희망장소를 입력해주세요" v-model="location" />
      </div>
    </div>

    <div class="form-group row">
      <label for="tags">태그</label>
      <div class="tags-select">
        <input type="text" id="tags" placeholder="태그를 입력해주세요" v-model="tags" />
      </div>
    </div>

    <div class="form-actions">
      <button class="register" @click="submitForm">등록하기</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormComponent',
  data() {
    return {
      title: '',
      photos: [], // 파일 객체만 저장
      previews: [], // 미리보기 URL만 저장
      price: '',
      description: '',
      isDirectTrade: false,
      isDeliveryTrade: false,
      location: '',
      tags: '',
      maxPhotos: 3, // 최대 업로드 가능 개수
    };
  },
  methods: {
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      const validFiles = files.filter(file => file.type.startsWith('image/'));

      const availableSlots = this.maxPhotos - this.photos.length;
      if (validFiles.length > availableSlots) {
        alert(`사진은 최대 ${this.maxPhotos}개까지 업로드 가능합니다.`);
        return;
      }

      validFiles.slice(0, availableSlots).forEach(file => {
        const preview = URL.createObjectURL(file);
        this.photos.push(file); // 파일 객체만 저장
        this.previews.push(preview); // 미리보기 URL만 저장
      });
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileDelete(index) {
      URL.revokeObjectURL(this.previews[index]); // 미리보기 URL 해제
      this.photos.splice(index, 1); // 파일 삭제
      this.previews.splice(index, 1); // 미리보기 URL 삭제
    },
    submitForm() {
      // 필수 필드 검증
      if (!this.title.trim()) {
        alert('제목을 입력해주세요.');
        return;
      }
      if (this.photos.length === 0) {
        alert('최소 1장의 사진을 업로드해야 합니다.');
        return;
      }
      if (!this.price.trim()) {
        alert('가격을 입력해주세요.');
        return;
      }
      if (!this.description.trim()) {
        alert('설명을 입력해주세요.');
        return;
      }
      if (!this.isDirectTrade && !this.isDeliveryTrade) {
        alert('직거래 또는 택배거래 중 하나를 선택해주세요.');
        return;
      }
      if (this.isDirectTrade && !this.location.trim()) {
        alert('직거래 선택 시 거래 희망 장소를 입력해주세요.');
        return;
      }

      // FormData 객체로 데이터 준비
      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('price', this.price);
      formData.append('description', this.description);
      formData.append('isDirectTrade', this.isDirectTrade);
      formData.append('isDeliveryTrade', this.isDeliveryTrade);
      formData.append('location', this.location);
      formData.append('tags', this.tags);
      
      this.photos.forEach((file, index) => {
        formData.append(`photo${index + 1}`, file); // 파일만 추가
      });

      // 서버로의 데이터 전송 (주석 처리)
      /*
      axios.post('/upload', formData)
        .then(response => {
          alert('등록 성공!');
          this.resetForm();
        })
        .catch(error => {
          alert('등록 실패. 다시 시도해주세요.');
          console.error(error);
        });
      */

      console.log('Form Data:', {
        title: this.title,
        price: this.price,
        description: this.description,
        isDirectTrade: this.isDirectTrade,
        isDeliveryTrade: this.isDeliveryTrade,
        location: this.location,
        tags: this.tags,
        photos: this.photos,
      });

      // 입력 필드 초기화
      this.resetForm();
    },
    resetForm() {
      this.title = '';
      this.photos = [];
      this.previews.forEach(preview => URL.revokeObjectURL(preview)); // 모든 미리보기 URL 해제
      this.previews = [];
      this.price = '';
      this.description = '';
      this.isDirectTrade = false;
      this.isDeliveryTrade = false;
      this.location = '';
      this.tags = '';
    },
  },
};

</script>



<style scoped>
.form-container {
  width: 960px;
  margin: 0 auto;
  padding: 20px;
  border: solid black;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-family: Avenir, Helvetica, Arial, sans-serif;
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

.description-group textarea {
  width: 100%;
  height: 150px;
  margin-left: 20px;
}

label {
  font-weight: bold;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

input[type='text'],
textarea {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin-left: 20px;
}

.photo-upload {
  display: flex;
  align-items: center;
  gap: 10px;
}

.location-select,
.tags-select {
  display: flex;
  align-items: center;
  width: 300px;
  gap: 10px;
}

button {
  padding: 8px 12px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

button.delete {
  background-color: #dc3545;
}

button.modify {
  background-color: #28a745;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.form-group button,
.form-group p {
  text-align: center;
  margin: 0 auto;
  display: block;
  font-weight: bold;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.form-group p {
  color: #2c3e50;
}

.trade-options {
  display: flex;
  gap: 10px;
}

button.router-link-exact-active {
  color: #42b983;
}

/* 이미지 미리보기 스타일 */
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

</style>
