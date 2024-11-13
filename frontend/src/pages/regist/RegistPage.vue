<template>
  <div class="form-container">
    <div class="form-group row">
      <label for="title">제목</label>
      <input type="text" id="title" placeholder="제목을 입력하세요" />
    </div>

    <div class="form-group row">
      <label for="photos">사진</label>
      <div class="photo-upload">
        <input type="file" id="photos" accept="image/*" multiple />
      </div>
    </div>

    <div class="form-group row">
      <label for="price">가격</label>
      <input type="text" id="price" placeholder="가격을 입력하세요" />
    </div>

    <div class="form-group row description-group">
      <label for="description">설명</label>
      <textarea id="description" placeholder="판매하실 상품의 설명을 적어주세요."></textarea>
    </div>

    <div class="form-group row">
      <label>거래 방식</label>
      <div class="trade-options">
        <input type="checkbox" id="direct" v-model="isDirectTrade" />
        <label for="direct">직거래</label>
        <input type="checkbox" id="delivery" />
        <label for="delivery">택배거래</label>
      </div>
    </div>

    <div v-if="isDirectTrade" class="form-group row">
      <label for="location">거래희망장소</label>
      <div class="location-select">
        <input type="text" id="location" placeholder="거래희망장소를 입력해주세요" />
      </div>
    </div>

    <div class="form-group row">
      <label for="tags">태그</label>
      <div class="tags-select">
        <input type="text" id="tags" placeholder="태그를 입력해주세요" />
      </div>
    </div>

    <div class="form-actions">
      <button class="register">등록하기</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormComponent',
  data() {
    return {
      title: '',
      photos: [],
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
      
      if (validFiles.length + this.photos.length > this.maxPhotos) {
        alert(`사진은 최대 ${this.maxPhotos}개까지 업로드 가능합니다.`);
        return;
      }

      this.photos = [...this.photos, ...validFiles].slice(0, this.maxPhotos);
    },
    submitForm() {
      if (this.photos.length === 0) {
        alert('최소 1장의 사진을 업로드해야 합니다.');
        return;
      }

      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('price', this.price);
      formData.append('description', this.description);
      formData.append('isDirectTrade', this.isDirectTrade);
      formData.append('isDeliveryTrade', this.isDeliveryTrade);
      formData.append('location', this.location);
      formData.append('tags', this.tags);
      
      this.photos.forEach((photo, index) => {
        formData.append(`photo${index + 1}`, photo);
      });

      // 서버로의 전송 예시 (axios 사용 가능)
      // axios.post('/upload', formData)
      //   .then(response => {
      //     alert('등록 성공!');
      //   })
      //   .catch(error => {
      //     alert('등록 실패');
      //   });
      
      console.log('Form submitted with data:', formData); // 콘솔로 데이터 확인
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
  margin-left: 10px;
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
</style>
