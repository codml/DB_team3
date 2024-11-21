<template>
  <div class="product-detail" v-if="Object.keys(product).length > 0">
    <!-- 이미지 슬라이더 -->
    <div class="image-slider">
      <div class="slider-container">
        <img
          :src="getCurrentImage()"
          alt="상품 이미지"
          class="main-image"
        />
        <button
          class="arrow-button left"
          @click="prevImage"
          :disabled="currentImageIndex === 0"
        >
          ◀
        </button>
        <button
          class="arrow-button right"
          @click="nextImage"
          :disabled="currentImageIndex === imageSources.length - 1"
        >
          ▶
        </button>
      </div>
      <p class="image-info">
        이미지 {{ currentImageIndex + 1 }} / {{ imageSources.length }}
      </p>
    </div>

    <!-- 제목 -->
    <h1 class="product-title">{{ product.Title }}</h1>

    <!-- 상품 정보 -->
    <div class="product-info">
      <div class="info-row">
        <p><strong>등록일:</strong> {{ formatDate(product.Reg_date) }}</p>
        <p><strong>가격:</strong> {{ product.Price }}원</p>
      </div>
      <div class="info-row">
        <p><strong>카테고리:</strong> {{ product.Group1 }} > {{ product.Group2 }}</p>
        <p><strong>태그:</strong> {{ product.Group3 }}</p>
      </div>
      <div class="info-row">
        <p><strong>선호 거래 방식: </strong> {{ product.Deal_way }}</p>
        <p v-if="product.Deal_way === 0"><strong>지역:</strong> {{ product.Place }}</p>
      </div>
      <div class="info-row">
        <!-- 찜 버튼 추가 -->
        <button @click="likeProduct" class="like-button">
          ❤ {{ product.Like_cnt }}
        </button>
      </div>
    </div>

    <!-- 내용 -->
    <section class="product-description">
      <h2>상품 내용</h2>
      <p>{{ product.Content }}</p>
    </section>

    <!-- 삭제 버튼 추가 -->
    <div class="action-buttons" v-if="product.Uid === userID || auth === 1">
      <button @click="deleteProduct" class="delete-button">삭제</button>
    </div>
  </div>
  <div v-else>
    <p>로딩 중...</p>
  </div>
</template>

<script>
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default {
  props: ["ino"],
  data() {
    return {
      product: {},
      userID: "",
      auth: "",
      imageSources: [], // 이미지 소스 목록
      currentImageIndex: 0, // 현재 이미지 인덱스
    };
  },
  methods: {
    async fetchProductDetails() {
      try {
        const response = await axios.get(`http://localhost:3000/read/${this.ino}`);
        if (response.data) {
          const token = localStorage.getItem("token");
          const user = jwtDecode(token);
          this.userID = user.userID;
          this.auth = user.auth;
          this.product = response.data[0];

          // 이미지 데이터를 초기화
          this.imageSources = [
            this.product.Image,
            this.product.Subimg1,
            this.product.Subimg2,
          ].filter((img) => img); // null이 아닌 이미지만 추가
        } else {
          console.error("상품 데이터를 가져오지 못했습니다.");
        }
      } catch (error) {
        console.error("상품 정보를 가져오는 중 오류 발생:", error);
      }
    },
    getCurrentImage() {
      return `data:image/jpeg;base64,${this.imageSources[this.currentImageIndex]}`;
    },
    nextImage() {
      if (this.currentImageIndex < this.imageSources.length - 1) {
        this.currentImageIndex += 1;
      }
    },
    prevImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex -= 1;
      }
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateString).toLocaleDateString("ko-KR", options);
    },
    async likeProduct() {
      try {
        const response = await axios.post(`http://localhost:3000/read/${this.ino}`, {
          likeCount: this.product.Like_cnt + 1,
        });
        if (response.data.success) {
          this.product.Like_cnt += 1;
        } else {
          console.error("찜 업데이트 실패");
        }
      } catch (error) {
        console.error("찜 업데이트 중 오류 발생:", error);
      }
    },
    async deleteProduct() {
      try {
        const response = await axios.post(`http://localhost:3000/read/${this.ino}`);
        if (response.data.success) {
          alert("게시글이 삭제되었습니다.");
          this.$router.push("/search");
        } else {
          console.error("게시글 삭제 실패");
        }
      } catch (error) {
        console.error("게시글 삭제 중 오류 발생:", error);
      }
    },
  },
  mounted() {
    this.fetchProductDetails();
  },
};
</script>

<style scoped>
.product-detail {
  max-width: 900px;
  margin: 30px auto;
  padding: 30px;
  border: 2px solid #ccc;
  border-radius: 15px;
  background-color: #f9f9f9;
}

.image-slider {
  position: relative;
  text-align: center;
  margin-bottom: 30px;
}

.slider-container {
  position: relative;
  max-width: 100%;
  height: 600px; /* 원하는 높이 설정 */
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid #ccc;
  display: flex; /* 이미지 중앙 정렬을 위해 추가 */
  justify-content: center; /* 가로 중앙 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  background-color: #f9f9f9; /* 빈 공간 색상 */
}

.main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* 이미지가 짤리지 않고 전체가 보이도록 설정 */
}

.arrow-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  z-index: 1;
}

.arrow-button.left {
  left: 10px;
}

.arrow-button.right {
  right: 10px;
}

.arrow-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-info {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.product-title {
  font-size: 28px;
  font-weight: bold;
  margin: 20px 0;
  text-align: center;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-row {
  display: flex;
  gap: 20px;
  font-size: 16px;
}

.product-description {
  margin-top: 30px;
  border-top: 2px solid #ccc;
  padding-top: 15px;
}

.product-description h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.product-description p {
  font-size: 18px;
  line-height: 1.6;
}

.like-button {
  background-color: #ff6f61;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 16px;
}

.like-button:hover {
  background-color: #e65b50;
}

.delete-button {
  margin-top: 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
}

.delete-button:hover {
  background-color: #c0392b;
}
</style>

