<template>
  <div class="form-container">
    <div class="form-group row">
      <label for="title">제목</label>
      <input type="text" id="title" placeholder="제목을 입력하세요" v-model="title" />
    </div>

    <div class="form-group row">
      <label for="photos">사진</label>
      <div class="photo-upload">
        <!-- 기존 사진 표시 -->
        <div class="photo-previews">
          <div v-for="(photo, index) in existPhotos" :key="'existing-' + index" class="photo-item">
            <img :src="`data:image/jpeg;base64,${photo}`" alt="기존 이미지 미리보기" class="preview-image" />
            <label>
              <input type="checkbox" v-model="photoSelection[index]" /> 유지
            </label>
          </div>
        </div>

        <!-- 새로 추가된 사진 -->
        <input type="file" id="photos" accept="image/*" multiple @change="handleFileUpload" ref="fileInput" style="display: none;" />
        <button type="button" @click="triggerFileInput">파일 선택</button>
        <div class="photo-previews">
          <div v-for="(preview, index) in previews" :key="'new-' + index" class="photo-item">
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
      <input type="text" id="location" placeholder="거래희망장소를 입력해주세요" v-model="location" />
    </div>

    <div class="form-group row">
      <label for="tags">태그</label>
      <input type="text" id="tags" placeholder="태그를 입력해주세요" v-model="tags" />
    </div>

    <div class="form-group row">
      <label for="mainCategory">대분류</label>
      <input type="text" id="mainCategory" placeholder="대분류를 입력해주세요" v-model="mainCategory" />
    </div>

    <div class="form-group row">
      <label for="subCategory">소분류</label>
      <input type="text" id="subCategory" placeholder="소분류를 입력해주세요" v-model="subCategory" />
    </div>

    <div class="form-actions">
      <button class="register" @click="submitForm">수정하기</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["ino"],
  data() {
    return {
      title: "",
      existPhotos: [],
      photoSelection: [],
      photos: [],
      previews: [],
      price: "",
      description: "",
      Deal_way: 1,
      location: "",
      tags: "",
      mainCategory: "",
      subCategory: "",
      maxPhotos: 3,
    };
  },
  methods: {
    async loadFormData() {
      try {
        const response = await axios.get(`http://localhost:3000/read/${this.ino}`);
        if (response.data) {
          const res = response.data[0];
          this.title = res.Title;
          this.price = res.Price;
          this.description = res.Content;
          this.Deal_way = res.Deal_way;
          this.location = res.Place;
          this.tags = res.Group3;
          this.mainCategory = res.Group1;
          this.subCategory = res.Group2;

          this.existPhotos = [res.Image, res.Subimg1, res.Subimg2]
          this.photoSelection = Array(this.existPhotos.length).fill(true);
        } else {
          console.error("상품 데이터를 가져오지 못했습니다.");
        }
      } catch (error) {
        console.error("상품 정보를 가져오는 중 오류 발생:", error);
      }
    },
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      const validFiles = files.filter((file) => file.type.startsWith("image/"));

      // 기존 선택된 사진 수 확인
      const totalPhotos = this.photos.length + this.photoSelection.filter(Boolean).length;
      const availableSlots = this.maxPhotos - totalPhotos;

      if (validFiles.length > availableSlots) {
        alert(`사진은 최대 ${this.maxPhotos}개까지 업로드 가능합니다.`);
        return;
      }

      // 새로 추가된 사진의 미리보기 URL 생성
      validFiles.slice(0, availableSlots).forEach((file) => {
        const preview = URL.createObjectURL(file);
        this.photos.push(file); // 실제 파일 저장
        this.previews.push(preview); // 미리보기 URL 저장
      });

      // 디버그 출력
      console.log("Photos:", this.photos);
      console.log("Previews:", this.previews);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileDelete(index) {
      URL.revokeObjectURL(this.previews[index]);
      this.photos.splice(index, 1);
      this.previews.splice(index, 1);
    },
    async submitForm() {

      const formData = new FormData();
      formData.append("Title", this.title);
      formData.append("Price", this.price);
      formData.append("Content", this.description);
      formData.append("Deal_way", this.Deal_way);
      formData.append("Place", this.location);
      formData.append("Group1", this.mainCategory);
      formData.append("Group2", this.subCategory);
      formData.append("Group3", this.tags);

      this.existPhotos.forEach((photo, index) => {
        if (this.photoSelection[index]) {
          formData.append(`ExistingImage${index + 1}`, photo);
        }
      });

      this.photos.forEach((file, index) => {
        formData.append(`NewImage${index + 1}`, file);
      });
      try {
        await axios.patch(`http://localhost:3000/update/${this.ino}`, formData);
        alert("수정 성공!");
        this.$emit("updateComplete");
      } catch (error) {
        alert("수정 실패. 다시 시도해주세요.");
        console.error(error);
      }
    },
  },
  mounted() {
    this.loadFormData();
  },
};
</script>


<style scoped>
/* 메인 컨테이너 스타일 */
.form-container {
  width: 960px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #333; /* 검은색 테두리 유지 */
  border-radius: 10px;
  background-color: #f9f9f9; /* 밝은 배경색 추가 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 살짝 더 강한 그림자 */
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

/* 폼 그룹 */
.form-group {
  margin-bottom: 16px;
}

.form-group.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #ddd;
  padding: 12px 0; /* 패딩 약간 늘림 */
}

.description-group textarea {
  width: 100%;
  height: 150px;
  margin-left: 20px;
}

/* 공통 텍스트 스타일 */
label {
  font-weight: bold;
  color: #333; /* 텍스트 색상 다크 그레이 */
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

input[type='text'],
textarea {
  flex: 1;
  padding: 10px; /* 인풋 필드 패딩 늘림 */
  border: 1px solid #bbb; /* 테두리 약간 밝게 */
  border-radius: 4px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin-left: 20px;
}

/* 사진 업로드 */
.photo-upload {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 위치와 태그 입력 */
.location-select,
.tags-select {
  display: flex;
  align-items: center;
  width: 300px;
  gap: 15px;
}

/* 버튼 스타일 */
button {
  padding: 10px 14px; /* 버튼 크기 약간 늘림 */
  border: none;
  background-color: #007bff; /* 파란 버튼 */
  color: white;
  border-radius: 5px; /* 둥근 테두리 */
  cursor: pointer;
  font-size: 14px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

button:hover {
  background-color: #0056b3; /* hover 효과 */
}

button.delete {
  background-color: #dc3545;
}

button.modify {
  background-color: #28a745;
}

button.delete:hover {
  background-color: #c82333;
}

button.modify:hover {
  background-color: #218838;
}

/* 폼 액션 */
.form-actions {
  display: flex;
  justify-content: flex-end;
}

/* 폼 그룹 버튼과 텍스트 */
.form-group button,
.form-group p {
  text-align: center;
  margin: 0 auto;
  display: block;
  font-weight: bold;
}

.form-group p {
  color: #444; /* 다크 그레이 */
}

/* 거래 방식 선택 */
.trade-options {
  display: flex;
  gap: 15px;
}

button.router-link-exact-active {
  color: #42b983;
}

/* 이미지 미리보기 */
.photo-previews {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px; /* 간격을 넓게 */
}

.photo-item {
  position: relative;
  display: inline-block;
}

.preview-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px; /* 둥근 모서리 */
  border: 1px solid #ccc;
}

.photo-item button {
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 3px 8px; /* 크기 조정 */
  border: none;
  background-color: #dc3545;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

/* 카테고리 선택 */
.category-select {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 스타일링 추가 */
.form-container.update-mode {
  background-color: #fdfdfd; /* 업데이트 페이지에서는 약간 더 밝은 배경색 */
}

button.register {
  background-color: #ffc107; /* 업데이트 버튼은 노란색 */
}

button.register:hover {
  background-color: #e0a800;
}
</style>
