<template>
  <div class="form-container">
    <div class="form-group row">
      <label for="title">제목</label>
      <input type="text" id="title" placeholder="제목을 입력하세요" />
    </div>

    <div class="form-group row">
      <label for="photos">사진</label>
      <div class="photo-upload">
        <p>대표 사진 1개, 추가 사진 2개. 총 3개까지 업로드 가능합니다.</p>
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
      isDirectTrade: false,
    };
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
