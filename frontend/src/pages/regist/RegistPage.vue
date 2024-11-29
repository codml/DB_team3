<template>
  <div class="form-container">
    <div class="form-group row">
      <label for="title">제목</label>
      <input type="text" id="title" placeholder="제목을 입력하세요" v-model="title" />
    </div>

    <div class="form-group row">
      <label for="photos">사진</label>
      <div class="photo-upload">
        <input type="file" id="photos" accept="image/*" multiple @change="handleFileUpload" ref="fileInput" style="display: none;" />
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
      <div>
        <label>
          <input type="radio" v-model="Deal_way" :value="0" />
          직거래
        </label>
        <label>
          <input type="radio" v-model="Deal_way" :value="1" />
          택배거래
        </label>
      </div>
    </div>

    <div v-if="Deal_way === 0" class="form-group row">
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

    <!-- 대분류 입력란 -->
    <div class="form-group row">
      <label for="mainCategory">대분류</label>
      <div class="category-select">
        <input type="text" id="mainCategory" placeholder="대분류를 입력해주세요" v-model="mainCategory" />
      </div>
    </div>

    <!-- 소분류 입력란 -->
    <div class="form-group row">
      <label for="subCategory">소분류</label>
      <div class="category-select">
        <input type="text" id="subCategory" placeholder="소분류를 입력해주세요" v-model="subCategory" />
      </div>
    </div>

    <div class="form-actions">
      <button class="register" @click="submitForm">등록하기</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {jwtDecode} from "jwt-decode";
export default {
  name: 'FormComponent',
  data() {
    return {
      title: '',
      photos: [],
      previews: [],
      price: '',
      description: '',
      Deal_way: 1, // 직거래를 기본값으로 설정
      location: '',
      tags: '',
      mainCategory: '',
      subCategory: '',
      maxPhotos: 3,
    };
  },
  computed: {
    isFormValid() {
      const isLocationValid = this.Deal_way === 0 ? !!this.location : true;

      return (
        !!this.title &&
        !!this.price &&
        !!this.description &&
        this.Deal_way !== null &&
        isLocationValid &&
        !!this.tags &&
        !!this.mainCategory &&
        !!this.subCategory &&
        this.photos.length > 0 // 배열이 비어있지 않은지 확인
      );
    },
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
        this.photos.push(file);
        this.previews.push(preview);
      });
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileDelete(index) {
      URL.revokeObjectURL(this.previews[index]);
      this.photos.splice(index, 1);
      this.previews.splice(index, 1);
    },
    submitForm() {
      if (!this.isFormValid) {
        alert("모든 필드를 입력해주세요.");
        return;
      }
      const token = localStorage.getItem('token');
      const user = jwtDecode(token);

      const formData = new FormData();
      formData.append('Uid', user.userID);
      formData.append('Title', this.title);
      formData.append('Price', this.price);
      formData.append('Content', this.description);
      formData.append('Place', this.location);
      formData.append('Group1', this.mainCategory);
      formData.append('Group2', this.subCategory);
      formData.append('Group3', this.tags); // tags를 Group3로 매핑
      formData.append('Deal_way', this.Deal_way); // Deal_way 값을 그대로 전송

      this.photos.forEach((file, index) => {
        if (index === 0) formData.append('Image', file);
        else if (index === 1) formData.append('Subimg1', file);
        else if (index === 2) formData.append('Subimg2', file);
      });

      axios.post('http://localhost:3000/write', formData)
        .then(() => {
          alert('등록 성공!');
          this.resetForm();
          // 등록 성공 후 상품 검색 페이지로 리다이렉트
          this.$router.push({ name: 'search' });
        })
        .catch(error => {
          alert('등록 실패. 다시 시도해주세요.');
          console.error(error);
        });
    },
    resetForm() {
      this.title = '';
      this.photos = [];
      this.previews.forEach(preview => URL.revokeObjectURL(preview));
      this.previews = [];
      this.price = '';
      this.description = '';
      this.isDirectTrade = false;
      this.isDeliveryTrade = false;
      this.location = '';
      this.tags = '';
      this.mainCategory = '';
      this.subCategory = '';
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

.form-container {
  width: 960px;
  margin: 0 auto;
  padding: 20px;
  border: solid black;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.category-select {
  display: flex;
  align-items: center;
  gap: 10px;
}

</style>
