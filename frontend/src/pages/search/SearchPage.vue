<template>
  <div id="app">
    <main>
      <!-- 검색 및 정렬 필터 -->
      <section class="center-search">
        <h1 class="search-title">검색 필터</h1>
        <div class="filter-container">
          <div class="row">
            <div class="input-group">
              <label for="main-category">대분류:</label>
              <input
                type="text"
                id="main-category"
                v-model="mainCategory"
                placeholder="대분류 입력"
              />
            </div>
            <div class="input-group">
              <label for="sub-category">소분류:</label>
              <input
                type="text"
                id="sub-category"
                v-model="subCategory"
                placeholder="소분류 입력"
              />
            </div>
          </div>

          <div class="row">
            <div class="input-group keyword-group">
              <label for="search-query">제목 키워드:</label>
              <div class="search-bar">
                <input
                  type="text"
                  id="search-query"
                  v-model="searchQuery"
                  placeholder="검색할 상품 제목 입력"
                />
              </div>
            </div>
            <div class="input-group price-group">
              <label for="price-range">가격:</label>
              <div class="price-inputs">
                <input
                  type="number"
                  v-model.number="priceFrom"
                  placeholder="최소 가격"
                />
                ~
                <input
                  type="number"
                  v-model.number="priceTo"
                  placeholder="최대 가격"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 검색 버튼 -->
        <div class="center-button">
          <button class="search-button" @click="fetchPosts">검색</button>
        </div>

        <div class="filter-buttons">
          <button @click="setSortOption('찜 많은 순')">찜 많은 순</button>
          <button @click="setSortOption('가격 순')">가격 순</button>
          <button @click="setSortOption('최신 순')">최신 순</button>
        </div>
      </section>

      <!-- 게시물 목록 -->
      <section class="product-grid">
        <template v-if="posts.length > 0">
          <div
            v-for="(product, index) in posts"
            :key="index"
            class="product-card"
            @click="redirectToRead(product.Ino)"
          >
            <div class="product-image">
              <img
                v-if="product.Image"
                :src="`data:image/jpeg;base64,${product.Image}`"
                alt="상품 이미지"
              />
              <div v-else class="no-image">이미지 없음</div>
            </div>
            <div class="product-info">
              <h3>{{ product.Title }}</h3>
              <p>가격: {{ product.Price }}원</p>
              <p>찜: ❤ {{ product.Like_cnt }}</p>
              <p>
                [지역: {{ product.Place }} | 게시일: {{ formatDate(product.Reg_date) }} |
                분류: {{ product.Group1 }}]
              </p>
            </div>
          </div>
        </template>
        <div v-else class="no-posts">
          게시물이 없습니다.
        </div>
      </section>

      <!-- 페이지네이션 -->
      <section class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
          이전
        </button>
        <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          다음
        </button>
      </section>
    </main>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      mainCategory: "",
      subCategory: "",
      priceFrom: null,
      priceTo: null,
      searchQuery: "",
      sortOption: "최신 순",
      itemsPerPage: 9, // 한 페이지에 표시할 게시물 수
      allPosts: [], // 전체 게시물 데이터를 저장
      currentPage: 1, // 현재 페이지 번호
    };
  },
  computed: {
    posts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return Array.isArray(this.allPosts) ? this.allPosts.slice(start, end) : [];
    },
    totalPages() {
      return Math.ceil(this.allPosts.length / this.itemsPerPage);
    },
  },
  methods: {
    // 게시물 데이터를 백엔드에서 가져옴
    async fetchPosts() {
      try {
        const response = await axios.get("http://localhost:3000/search", {
          params: {
            mainCategory: this.mainCategory,
            subCategory: this.subCategory,
            priceFrom: this.priceFrom,
            priceTo: this.priceTo,
            searchQuery: this.searchQuery,
            sortOption: this.sortOption,
          },
        });
        console.log("Axios 응답 데이터:", response.data);

        if (Array.isArray(response.data)) {
          this.allPosts = response.data.map(post => ({
            ...post,
            Reg_date: post.Reg_date, // 날짜 형식 변환이 필요할 경우 추가
          }));
        } else {
          console.error("응답 데이터가 배열이 아닙니다.");
          this.allPosts = [];
        }

        this.currentPage = 1; // 새로운 데이터를 가져오면 첫 페이지로 초기화
      } catch (error) {
        console.error("게시물 데이터를 가져오는 중 오류 발생:", error);
        this.allPosts = []; // 실패 시 빈 배열로 초기화
      }
    },

    setSortOption(option) {
      this.sortOption = option;
      this.fetchPosts();
    },

    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },

    redirectToRead(ino) {
      this.$router.push(`/read/${ino}`);
    },

    formatDate(dateString) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateString).toLocaleDateString("ko-KR", options);
    },
  },
  mounted() {
    this.fetchPosts();
  },
};
</script>

<style scoped>

#app {
  font-family: Arial, sans-serif;
  max-width: 1024px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.center-search {
  width: 1000px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.search-title {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.filter-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px; /* 섹션 간 간격 */
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* 위쪽 정렬 */
  width: 100%;
  gap: 50px; /* 대분류와 소분류 사이 간격 */
}

.input-group {
  flex: 1; /* 균등한 공간 배분 */
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-group label {
  font-weight: bold;
  text-align: center;
}

.input-group input {
  padding: 8px;
  font-size: 14px;
  width: 100%;
}

.keyword-group {
  flex: 2;
}

.price-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.price-inputs input {
  width: calc(50% - 10px); /* 입력창 50% 크기 조정 */
  padding: 8px;
  font-size: 14px;
}

.center-button {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.search-button {
  width: 500px; /* 버튼 너비를 가로로 길게 설정 */
  height: 30%; /* 버튼 높이를 얇게 설정 */
  font-size: 16px;
  font-weight: bold;
  background-color: #d3d3d3; /* 기본 회색 */
  color: #000; /* 기본 검은색 텍스트 */
  border: 2px solid #000; /* 검정색 테두리 */
  border-radius: 0; /* 모서리를 둥글게 하지 않음 */
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.search-button:hover {
  background-color: #42b983; /* 민트색 */
  color: #fff; /* 호버 시 흰색 텍스트 */
}

.filter-buttons {
  align-self: flex-end;
  display: flex;
  gap: 10px;
}

.filter-buttons button {
  padding: 10px 20px;
  font-size: 14px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  cursor: pointer;
  border-radius: 5px;
}

.filter-buttons button:hover {
  background-color: #42b983;
  color: #fff;
  border-color: #42b983;
  transition: 0.5s;
}

@media (max-width: 768px) {
  .center-search {
    width: 90%;
  }

  .row {
    flex-direction: column;
    gap: 20px;
  }

  .price-inputs {
    flex-direction: column;
    gap: 10px;
  }
}


.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3개의 동일한 크기의 컬럼 */
  gap: 20px;
  margin-top: 20px;
  width: 100%; /* 전체 너비 사용 */
  max-width: 1024px; /* 최대 너비 제한 */
  margin-left: auto;
  margin-right: auto;
}

.product-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  background-color: #fff;
  width: 100%; /* 그리드 셀 너비에 맞춤 */
  min-width: 0; /* 그리드 아이템 오버플로우 방지 */
  transition: border-color 0.3s ease; /* 부드러운 애니메이션 효과 */
}

.product-card:hover {
  background-color: #42b983;
  border-color: #42b983; /* 마우스를 올렸을 때 테두리 색 변경 */
  transition: 0.5s;
}

.product-image {
  width: 100%;
  aspect-ratio: 1; /* 정사각형 비율 유지 */
  overflow: hidden; /* 이미지 넘침 방지 */
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지 비율 유지하며 컨테이너 채우기 */
  display: block;
}

.product-info {
  margin-top: 10px;
}

.product-info h3 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  line-height: 1.4;
}

.product-info p {
  margin: 4px 0;
  font-size: 0.9rem;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
}

.pagination button {
  padding: 5px 15px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  cursor: pointer;
  border-radius: 5px;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
</style>