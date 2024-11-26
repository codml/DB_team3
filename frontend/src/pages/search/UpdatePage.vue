<template>
  <div class="form-container">
    <div class="form-group row">
      <label for="title">제목</label>
      <input type="text" id="title" placeholder="제목을 입력하세요" v-model="title" />
    </div>
    <div class="form-group row">
      <label for="photos">사진</label>
      <div class="photo-upload">
        <div 
          v-for="(_, index) in 3" 
          :key="index"
          class="photo-section"
        >
          <h4 v-if="index === 0">대표 이미지</h4>
          <h4 v-else>서브 이미지 {{ index }}</h4>
          <!-- 기존 이미지 표시 -->
          <div class="photo-preview" v-if="existPhotos[index]">
            <div class="photo-item">
              <img 
                :src="`data:image/jpeg;base64,${existPhotos[index]}`" 
                :alt="`이미지 ${index + 1} 미리보기`" 
                class="preview-image" 
              />
              <label>
                <input 
                  type="checkbox" 
                  v-model="photoSelection[index]" 
                /> 유지
              </label>
            </div>
          </div>
          <!-- 새 이미지 업로드 -->
          <input 
            type="file" 
            accept="image/*" 
            @change="(e) => handleFileUpload(e, index)" 
            ref="photoInput" 
            :disabled="photoSelection[index]" 
            style="display: none;" 
          />
          <button 
            type="button" 
            @click="() => triggerFileInput(index)" 
            :disabled="photoSelection[index]"
          >
            이미지 선택
          </button>
          <div class="photo-preview" v-if="previews[index]">
            <div class="photo-item">
              <img 
                :src="previews[index]" 
                :alt="`새 이미지 ${index + 1} 미리보기`" 
                class="preview-image" 
              />
              <button 
                type="button" 
                @click="() => handleFileDelete(index)"
              >
                삭제
              </button>
            </div>
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
      photoSelection: [false, false, false],
      photos: [null, null, null],
      previews: [null, null, null],
      price: "",
      description: "",
      Deal_way: 1,
      location: "",
      tags: "",
      mainCategory: "",
      subCategory: "",
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
        !!this.subCategory
      );
    },
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

          this.existPhotos = [res.Image, res.Subimg1, res.Subimg2];
          this.photoSelection.forEach((_, index) => {
            if (this.existPhotos[index])
              this.photoSelection[index] = true;
          });
        }
      } catch (error) {
        console.error("상품 정보를 가져오는 중 오류 발생:", error);
      }
    },

    handleFileUpload(event, index) {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("이미지 파일만 업로드 가능합니다.");
        return;
      }

      if (this.previews[index]) {
        URL.revokeObjectURL(this.previews[index]);
      }

      const preview = URL.createObjectURL(file);
      this.photos[index] = file;
      this.previews[index] = preview;
    },

    triggerFileInput(index) {
      // this.$refs.photoInput은 배열로 저장됨
      const inputElement = this.$refs.photoInput[index];
      if (inputElement) {
        inputElement.click();
      } else {
        console.error(`파일 입력 요소를 찾을 수 없습니다. (index: ${index})`);
      }
    },

    handleFileDelete(index) {
      if (this.previews[index]) {
        URL.revokeObjectURL(this.previews[index]);
      }
      this.photos[index] = null;
      this.previews[index] = null;
    },

    async submitForm() {
      if (!this.isFormValid) {
        alert("모든 필드를 입력해주세요.");
        return;
      }
      const formData = new FormData();
      
      // 기본 필드들 추가
      formData.append("Title", this.title);
      formData.append("Price", this.price);
      formData.append("Content", this.description);
      formData.append("Deal_way", this.Deal_way);
      formData.append("Place", this.location);
      formData.append("Group1", this.mainCategory);
      formData.append("Group2", this.subCategory);
      formData.append("Group3", this.tags);

      // 기존 이미지 처리
      this.photoSelection.forEach((tf, index) => {
        if (index === 0) formData.append('isImage', tf);
        else if (index === 1) formData.append('isSubimg1', tf);
        else if (index === 2) formData.append('isSubimg2', tf);
      });

      // 새 이미지 처리
      this.photos.forEach((file, index) => {
        if (index === 0) formData.append('Image', file);
        else if (index === 1) formData.append('Subimg1', file);
        else if (index === 2) formData.append('Subimg2', file);
      });

      if (this.photoSelection[0] === false && this.photos[0] == null)
      {
        alert("대표 이미지는 반드시 있어야 합니다.");
        return;
      }

      try {
        await axios.put(`http://localhost:3000/update/${this.ino}`, formData);
        alert("수정 성공!");
        this.$router.push(`/read/${this.ino}`);
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
}

input[type='text'],
textarea {
  flex: 1;
  padding: 10px;
  border: 1px solid #bbb;
  border-radius: 4px;
  margin-left: 20px;
}

/* 버튼 스타일 */
button {
  padding: 10px 14px;
  border: none;
  background-color: #007bff; /* 파란 버튼 */
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #0056b3;
}

button.delete {
  background-color: #dc3545;
}

button.delete:hover {
  background-color: #c82333;
}

/* 폼 액션 */
.form-actions {
  display: flex;
  justify-content: flex-end;
}

/* 사진 업로드 */
.photo-upload {
  display: flex;
  flex-wrap: wrap; /* 여러 줄 허용 */
  gap: 15px; /* 사진 간 간격 */
  justify-content: space-between; /* 균등하게 배치 */
}

.photo-section {
  width: calc(33.333% - 10px); /* 3개의 이미지를 균등 배치 */
  box-sizing: border-box; /* 패딩과 테두리 포함 */
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  text-align: center; /* 텍스트 및 버튼 중앙 정렬 */
}

.photo-section h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.photo-preview {
  margin-top: 10px;
}

.photo-item {
  position: relative;
}

.preview-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #ccc;
}

/* 스타일링 추가 */
button.register {
  background-color: #ffc107;
}

button.register:hover {
  background-color: #e0a800;
}
</style>
