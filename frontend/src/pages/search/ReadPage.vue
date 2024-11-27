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
      <h2 class="product-title">{{ product.Title }}</h2>
    </div>
    <!-- 상품 정보 및 판매자 정보 레이아웃 -->
    <div class="info-layout">
      <!-- 상품 정보 -->
      <div class="product-info">
        <h2>상품 정보</h2>
        <p><strong>등록일:</strong> {{ formatDate(product.Reg_date) }}</p>
        <p><strong>가격:</strong> {{ product.Price }}원</p>
        <p><strong>카테고리:</strong> {{ product.Group1 }} > {{ product.Group2 }}</p>
        <p><strong>태그:</strong> {{ product.Group3 }}</p>
        <p v-if="product.Deal_way === 0"><strong>선호 거래 방식:</strong> 직거래</p>
        <p v-else><strong>선호 거래 방식:</strong> 택배 거래</p>
        <p v-if="product.Deal_way === 0"><strong>지역:</strong> {{ product.Place }}</p>
        <button @click="likeProduct" class="like-button">
          ❤ {{ product.Like_cnt }}
        </button>
      </div>

      <!-- 판매자 정보 -->
      <div class="seller-info">
        <h2>판매자 정보</h2>
        <p><strong>이름:</strong> {{ product.Uname }}</p>
        <p><strong>성별:</strong> {{ product.Sex }}</p>
        <p><strong>신고 당한 횟수:</strong> {{ product.Rp_cnt }}</p>
        <p><strong>평점:</strong> {{ product.Avg_rating }}</p>
      </div>

      <!-- 게시물 신고 -->
      <div class="report-info">
        <h2>게시물 신고</h2>
        <textarea
          v-model="reportContent"
          placeholder="신고 내용을 작성해주세요."
          class="report-textarea"
        ></textarea>
        <button @click="reportProduct" class="report-button">신고</button>
        
        <!-- 구매 요청 버튼 추가 -->
        <button @click="requestProduct" class="request-button">구매 요청</button>
      </div>
    </div>

    <!-- 내용 -->
    <section class="product-description">
      <h2>상품 내용</h2>
      <p>{{ product.Content }}</p>
    </section>

    <!-- 삭제 버튼 -->
    <div class="action-buttons-container">
      <button 
        v-if="product.Uid === userID || auth === 1" 
        @click="deleteProduct" 
        class="delete-button"
      >
        삭제
      </button>
      <button 
        v-if="product.Uid === userID" 
        @click="updateProduct" 
        class="update-button"
      >
        수정
      </button>
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
      imageSources: [],
      currentImageIndex: 0,
      reportContent: "",
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

          this.imageSources = [
            this.product.Image,
            this.product.Subimg1,
            this.product.Subimg2,
          ].filter((img) => img);
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
        if (this.product.Uid !== this.userID) {
          const response = await axios.post(`http://localhost:3000/hit/${this.ino}`, {
            Uid: this.userID,
          });
          if (response.data.success) {
            this.product.Like_cnt += 1;
          } else {
            alert("이미 좋아요를 눌렀습니다.");
          }
        }
      } catch (error) {
        console.error("찜 업데이트 중 오류 발생:", error);
      }
    },
    async reportProduct() {
      try {
        if (this.product.Uid === this.userID)
          return;
        if (this.reportContent.trim() === "") {
          alert("신고 내용을 작성해주세요.");
          return;
        }
        const response = await axios.post(`http://localhost:3000/report/${this.ino}`, {
          Uid: this.userID,
          content: this.reportContent,
        });
        if (response.data.success) {
          alert("신고가 접수되었습니다.");
          this.product.Rp_cnt += 1;
          this.reportContent = "";
        } else {
          alert("이미 신고한 게시물입니다.");
          this.reportContent = "";
          console.error("신고 중복");
        }
      } catch (error) {
        console.error("신고 처리 중 오류 발생:", error);
      }
    },
    async deleteProduct() {
      try {
        if (!confirm("정말로 삭제하시겠습니까?"))
          return;
        const response = await axios.get(`http://localhost:3000/delete/${this.ino}`);
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
    requestProduct() {
      this.$router.push(`/request/${this.ino}`); // 구매 요청 페이지로 이동
    },
    updateProduct() {
      this.$router.push(`/update/${this.ino}`);
    },
  },
  mounted() {
    this.fetchProductDetails();
  },
};
</script>

<style scoped>
/* 기본 스타일 */
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
  height: 600px;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
}

.main-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.product-title {
  text-align: center;
  font-size: 28px; /* 제목 크기 키움 */
  margin: 15px 0 10px; /* 이미지와 제목 간의 간격 */
  color: #333; /* 제목 색상 */
  font-weight: bold;
}

.info-layout {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3분할 */
  gap: 20px;
}

.product-info,
.seller-info,
.report-info {
  background: #fff;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.report-textarea {
  width: 100%;
  height: 100px; /* 신고 textarea 높이 조정 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.report-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  margin-top: 10px;
}

.report-button:hover {
  background-color: #c0392b;
}

/* 삭제 및 수정 버튼 */
.action-buttons-container {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
}

.delete-button,
.update-button {
  padding: 10px 20px;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button {
  background-color: #f44336;
  color: white;
}

.update-button {
  background-color: #4caf50;
  color: white;
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

/* 좋아요 버튼 원래 스타일 복구 */
.like-button {
  background-color: #ff6f61; /* 원래 색상 */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 16px; /* 버튼 텍스트 크기 */
}

.like-button:hover {
  background-color: #e65b50; /* 호버 색상 */
}

.request-button {
  margin-top: 10px;
  background-color: #3498db; /* 파란색 */
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  display: block; /* 버튼을 한 줄 아래로 배치 */
}

.request-button:hover {
  background-color: #2980b9; /* 호버 시 더 진한 파란색 */
}
</style>