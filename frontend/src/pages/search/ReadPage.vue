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
        
        <!-- 구매 요청 버튼 또는 후기 글 -->
        <div class="review-section">
          <!-- 구매 요청 버튼 -->
          <button
            v-if="product.B_uid === null"
            @click="requestProduct"
            class="request-button"
          >
            구매 요청
          </button>

          <!-- 후기 글 섹션 -->
          <div v-else>
            <!-- 현재 사용자가 구매자일 때 -->
            <div v-if="product.B_uid === userID">
              <h3>후기 글</h3>
              <textarea
                v-if="!product.ReviewContent"
                v-model="ReviewContent"
                placeholder="후기 내용을 작성해주세요."
                class="review-textarea"
              ></textarea>
              <!-- 별점 입력 -->
              <div v-if="!product.ReviewContent" class="rating-input">
                <span 
                  v-for="star in 5" 
                  :key="star" 
                  class="star" 
                  :class="{ active: star <= Ratings }"
                  @click="setRating(star)"
                >
                  ★
                </span>
              </div>
              <div v-else>
                <p><strong>내용:</strong> {{ product.ReviewContent }}</p>
                <div class="ratings-display">
                  <p><strong>별점:</strong></p>
                  <!-- 별점 출력 -->
                  <span
                    v-for="star in product.Ratings"
                    :key="'display-' + star"
                    class="star_static"
                  >
                    ★
                  </span>
                </div>
                <p><strong>등록일:</strong> {{ formatDate(product.ReviewReg_date) }}</p>
              </div>
              <button
                v-if="!product.ReviewContent"
                @click="submitReview"
                class="review-submit-button"
              >
                후기 저장
              </button>
            </div>
            <!-- 현재 사용자가 구매자가 아닐 때 -->
            <div v-else>
              <div v-if="!product.ReviewContent">
                <h4 align="center">판매 완료.</h4>
                <h4 align="center">리뷰가 아직 등록되지 않았습니다.</h4>
              </div>
              <div v-else>
                <p><strong>내용:</strong> {{ product.ReviewContent }}</p>
                <div class="ratings-display">
                  <p><strong>별점:</strong></p>
                  <!-- 별점 출력 -->
                  <span
                    v-for="star in product.Ratings"
                    :key="'display-' + star"
                    class="star_static"
                  >
                    ★
                  </span>
                </div>
                <p><strong>등록일:</strong> {{ formatDate(product.ReviewReg_date) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 내용 -->
    <section class="product-description">
      <h2>상품 내용</h2>
      <p>{{ product.Content }}</p>
    </section>
    <section class="qna-section">
      <h2>질문 및 답변</h2>
      <div
        v-for="(item) in qna"
        :key="item.QuesNo"
        class="qna-item"
        @click="toggleAnswerInput(item.QuesNo)"
      >
        <!-- 질문 -->
        <div v-if="item.Q_private === 1 && !(userID === item.Uid || product.Uid === userID)">
          <span class="lock-icon">🔒</span>   비밀 질문입니다.
        </div>
        <div v-else>
          <p class="question">
            <strong>작성자: </strong> {{ item.Username }}
            <span class="q-content"><strong>Q:</strong> {{ item.Question }}</span>
            <span class="q-date">({{ formatDate(item.Q_date) }})</span>
            <!-- 삭제 버튼 -->
            <button
              v-if="userID === item.Uid"
              @click="deleteQnA(item.QuesNo)"
              class="qna-delete-button"
            >
              삭제
            </button>
          </p>
        </div>
        <!-- 답변 -->
        <div v-if="item.A_private === 1 && !(userID === item.Uid || product.Uid === userID)">
          ㄴ <span class="lock-icon">🔒</span>   비밀 답변입니다.
        </div>
        <div v-else>
          <p v-if="item.AnsNo" class="answer">
            <strong>ㄴ A:</strong> {{ item.Answer }}
            <span class="a-date">({{ formatDate(item.A_date) }})</span>
            <button
              v-if="userID === product.Uid"
              @click="deleteQnA(item.AnsNo)"
              class="qna-delete-button"
            >
              삭제
            </button>
          </p>
          <!-- 답변 입력 섹션 -->
          <div v-else-if="userID === product.Uid">
            <div
              v-if="selectedQuestionIndex === item.QuesNo"
              class="answer-input"
              @click.stop
            >
              <textarea
                v-model="newQnA"
                placeholder="답변을 작성해주세요."
                class="answer-textarea"
              ></textarea>
              <label>
                <input
                  type="radio"
                  value="0"
                  v-model="Private"
                />
                공개
              </label>
              <label>
                <input
                  type="radio"
                  value="1"
                  v-model="Private"
                />
                비공개
              </label>
              <button @click.stop="submitQnA()" class="submit-answer-button">
                답변 저장
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 질문 작성 섹션 -->
      <div v-if="userID !== product.Uid" class="add-question">
        <textarea
          v-model="newQnA"
          placeholder="질문을 작성해주세요."
          class="question-textarea"
        ></textarea>
        <label>
          <input
            type="radio"
            value="0"
            v-model="Private"
          />
          공개
        </label>
        <label>
          <input
            type="radio"
            value="1"
            v-model="Private"
          />
          비공개
        </label>
        <button @click="submitQnA" class="submit-question-button">
          질문 등록
        </button>
      </div>
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
      qna: {},
      userID: "",
      auth: "",
      reportContent: "",
      imageSources: [],
      currentImageIndex: 0,
      ReviewContent: "", // 후기 내용
      Ratings: 0, // 별점 (1~5 정수 값)
      ReviewReg_date: "",
      Private: 0,// 질문, 답변 글의 공개/비공개 여부
      selectedQuestionIndex: null, // 현재 선택된 질문 인덱스
      newQnA: "", // 새로 입력하는 질문/답변 내용
    };
  },
  methods: {
    async fetchProductDetails() {
      try {
        const response1 = await axios.get(`http://localhost:3000/read/${this.ino}`);
        if (response1.data) {
          const token = localStorage.getItem("token");
          const user = jwtDecode(token);
          this.userID = user.userID;
          this.auth = user.auth;
          this.product = response1.data[0];

          this.imageSources = [
            this.product.Image,
            this.product.Subimg1,
            this.product.Subimg2,
          ].filter((img) => img);
        } else {
          console.error("상품 데이터를 가져오지 못했습니다.");
        }
        const response2 = await axios.get(`http://localhost:3000/readQnA/${this.ino}`);
        if (response2.data) {
          this.qna = response2.data;
          console.log(this.qna);
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
      const options = { year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit"};
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
    setRating(rating) {
      this.Ratings = rating; // 선택한 별점 설정
    },
    async submitReview() {
      if (this.Ratings === 0 || !this.ReviewContent) {
        alert("내용 및 별점을 입력해주세요!");
        return;
      }
      try {
        const response = await axios.post(`http://localhost:3000/review/${this.ino}`, {
          S_uid: this.product.Uid,
          B_uid: this.userID,
          Content: this.ReviewContent,
          Ratings: this.Ratings, // 별점도 서버로 전송
        });
        if (response.data.success) {
          alert("후기가 저장되었습니다.");
          window.location.reload();
        } else {
          alert("후기 저장에 실패했습니다.");
        }
      } catch (error) {
        console.error("후기 저장 중 오류 발생:", error);
      }
    },
    toggleAnswerInput(QuesNo) {
      if (this.selectedQuestionIndex === QuesNo) {
        this.selectedQuestionIndex = null; // 이미 열려있으면 닫기
      } else {
        this.selectedQuestionIndex = QuesNo; // 선택된 질문 열기
      }
    },
    async deleteQnA(QuesNo) {
      if (!confirm("정말로 삭제하시겠습니까?")) return;

      try {
        const response = await axios.delete(`http://localhost:3000/deleteQnA/${QuesNo}`);
        if (response.data.success) {
          alert("삭제되었습니다.");
          window.location.reload();
        } else {
          alert("삭제 실패");
          console.error("삭제 실패:", response.data.error);
        }
      } catch (error) {
        alert("삭제 중 오류 발생");
        console.error("삭제 중 오류 발생:", error);
      }
    },
    async submitQnA() {
      if (!this.newQnA.trim()) {
        alert("답변 내용을 입력해주세요.");
        return;
      }

      try {
        const response = await axios.post(`http://localhost:3000/writeQnA/${this.ino}`, {
          Ino: this.ino, // 상품 번호
          Content: this.newQnA,
          Private: this.Private, // 비밀 여부 (0: 공개, 1: 비공개) - 예시로 설정
          Q_uid: this.userID, // 질문 작성자 ID
          Ans_Qno: this.selectedQuestionIndex,
        });
        if (response.data.success) {
          alert("등록되었습니다.");
          this.newQnA= "";
          window.location.reload();
        } else {
          alert("등록 실패");
          console.error("등록 실패:", response.data.error);
        }
      } catch (error) {
        alert("등록 중 오류 발생");
        console.error("등록 중 오류 발생:", error);
      }
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

.qna-delete-button {
  background-color: #f44336;
  color: white;
  margin-left: 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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

/* 후기 글 섹션 스타일 */
.review-section {
  margin-top: 20px;
}

.review-content h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

.review-textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.review-submit-button {
  margin-top: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
}

.review-submit-button:hover {
  background-color: #2980b9;
}

.rating-input {
  margin: 10px 0;
}

.star {
  font-size: 24px;
  color: #ccc; /* 기본 별 색상 */
  cursor: pointer;
  transition: color 0.2s;
}

.star_static {
  font-size: 24px;
  color: #f1c40f; /* 기본 별 색상 */
}

.star.active {
  color: #f1c40f; /* 선택된 별 색상 (노란색) */
}

.star:hover {
  color: #f39c12; /* 호버 시 색상 */
}

.ratings-display {
  display: flex;
  align-items: center;
  gap: 5px;
}

.ratings-display p {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.qna-section {
  margin-top: 30px;
  background-color: #f9f9f9;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.qna-item {
  margin-bottom: 15px;
  padding: 10px;
  cursor: pointer; /* 클릭 가능하도록 변경 */
  border: 1px solid transparent; /* 기본 상태에서 투명한 테두리 */
  border-radius: 5px;
}

.qna-item:hover {
  border-color: #3498db; /* 호버 시 테두리 색 변경 */
  background-color: #f1f8ff; /* 호버 시 배경 색상 변경 */
}

.answer-input {
  margin-top: 10px;
  background: #fff;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.question {
  font-size: 16px;
  color: #333;
  margin: 5px 0;
  align-items: center; /* 자물쇠와 텍스트 정렬 */
}

.answer {
  font-size: 16px;
  color: #555;
  margin-left: 15px;
  background-color: #f1f8ff;
  border-left: 3px solid #3498db;
  padding-left: 10px;
  border-radius: 5px;
  align-items: center; /* 자물쇠와 텍스트 정렬 */
}

.q-date,
.a-date {
  font-size: 12px;
  color: #888;
  margin-left: 20px;
}

.q-content {
  margin-left: 20px;
}

.add-question {
  margin-top: 20px;
  background: #f9f9f9;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.question-textarea,
.answer-textarea {
  width: 95%;
  height: 80px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.submit-question-button,
.submit-answer-button {
  margin-top: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
}

.submit-question-button:hover,
.submit-answer-button:hover {
  background-color: #2980b9;
}

.answer-button {
  margin-top: 5px;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
}

.answer-button:hover {
  background-color: #1e8449;
}
</style>