<template>
  <div id="app">
    <main>
      <!-- 검색 및 정렬 필터 -->
      <section class="center-search">
        <div class="category-row">
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
          <div class="input-group">
            <label for="price-range">가격:</label>
            <input
              type="number"
              v-model.number="priceFrom"
              placeholder="최소 가격 입력"
            />
            ~
            <input
              type="number"
              v-model.number="priceTo"
              placeholder="최대 가격 입력"
            />
          </div>
          <button @click="fetchPosts">검색</button>
        </div>

        <div class="keyword-search">
          <label for="search-query">제목 키워드:</label>
          <div class="search-bar">
            <input
              type="text"
              id="search-query"
              v-model="searchQuery"
              placeholder="검색할 상품 제목 입력"
            />
            <button @click="fetchPosts">검색</button>
          </div>
        </div>

        <div class="filter-buttons">
          <button @click="setSortOption('찜 많은 순')">찜 많은 순</button>
          <button @click="setSortOption('좋아요 많은 순')">좋아요 많은 순</button>
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
          >
            <div class="product-image">
              <img :src="product.Image" alt="상품 이미지" />
            </div>
            <div class="product-info">
              <h3>{{ product.Title }}</h3>
              <p>가격: {{ product.Price }}원</p>
              <p>찜: ❤ {{ product.Like_cnt }}</p>
              <p>
                [지역: {{ product.Place }} | 게시일: {{ product.Reg_date }} |
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
          this.allPosts = response.data;
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
  margin-top: 20px;
}

.category-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-group input {
  padding: 10px;
  width: 200px;
  margin-top: 5px;
}

.input-group button {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  cursor: pointer;
  border-radius: 5px;
}

.keyword-search {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}

.keyword-search label {
  margin-bottom: 10px;
}

.search-bar {
  display: flex;
  gap: 10px;
}

.search-bar input {
  padding: 15px;
  width: 400px;
}

.search-bar button {
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  cursor: pointer;
  border-radius: 5px;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.filter-buttons button {
  padding: 10px 20px;
  border: 1px solid #ccc;
  background-color: #f8f8f8;
  cursor: pointer;
  border-radius: 5px;
}

.filter-buttons button:hover {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
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