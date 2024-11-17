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
            <button @click="fetchPosts">검색</button>
          </div>
          <div class="input-group">
            <label for="sub-category">소분류:</label>
            <input
              type="text"
              id="sub-category"
              v-model="subCategory"
              placeholder="소분류 입력"
            />
            <button @click="fetchPosts">검색</button>
          </div>
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
        <div
          v-for="product in posts"
          :key="product.id"
          class="product-card"
        >
          <div class="product-image">
            <img :src="product.image" alt="상품 이미지" />
          </div>
          <div class="product-info">
            <h3>{{ product.title }}</h3>
            <p>가격: {{ product.price }}원</p>
            <p>찜: ❤ {{ product.likes }}</p>
            <p>
              [지역: {{ product.location }} | 게시일: {{ product.date }} |
              분류: {{ product.category }}]
            </p>
          </div>
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
// import axios from 'axios';

export default {
  data() {
    return {
      mainCategory: "",
      subCategory: "",
      searchQuery: "",
      sortOption: "최신 순",
      itemsPerPage: 9, // 한 페이지에 표시할 게시물 수
      allPosts: [], // 전체 게시물 데이터를 저장
      currentPage: 1, // 현재 페이지 번호
    };
  },
  computed: {
    // 현재 페이지에 표시할 게시물
    posts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.allPosts.slice(start, end);
    },
    // 총 페이지 수 계산
    totalPages() {
      return Math.ceil(this.allPosts.length / this.itemsPerPage);
    },
  },
  methods: {
    // 게시물 데이터를 백엔드에서 가져옴
    async fetchPosts() {
      try {
        // // 백엔드에서 데이터를 요청하는 API 호출
        // const response = await axios.get('http://localhost:3000/search', {
        //   params: {
        //     mainCategory: this.mainCategory,
        //     subCategory: this.subCategory,
        //     searchQuery: this.searchQuery,
        //     sortOption: this.sortOption,
        //   },
        // });

        // 백엔드에서 받은 전체 게시물 데이터를 업데이트
        // this.allPosts = response.data.posts; // 전체 게시물 데이터 저장
        this.allPosts = [
        {
          id: 1,
          image: "https://via.placeholder.com/150",
          title: "전자기기 상품 1",
          price: "10,000",
          likes: 15,
          location: "서울",
          date: "2024-11-01",
          category: "전자기기",
          subCategory: "휴대폰",
        },
        {
          id: 2,
          image: "https://via.placeholder.com/150",
          title: "전자기기 상품 2",
          price: "20,000",
          likes: 25,
          location: "부산",
          date: "2024-11-02",
          category: "전자기기",
          subCategory: "컴퓨터",
        },
        {
          id: 3,
          image: "https://via.placeholder.com/150",
          title: "생활용품 상품 1",
          price: "5,000",
          likes: 10,
          location: "인천",
          date: "2024-11-03",
          category: "생활용품",
          subCategory: "주방용품",
        },
        {
          id: 4,
          image: "https://via.placeholder.com/150",
          title: "가구 상품 1",
          price: "30,000",
          likes: 18,
          location: "대구",
          date: "2024-11-04",
          category: "가구",
          subCategory: "침대",
        },
        {
          id: 5,
          image: "https://via.placeholder.com/150",
          title: "서적 상품 1",
          price: "8,000",
          likes: 12,
          location: "서울",
          date: "2024-11-05",
          category: "서적",
          subCategory: "소설",
        },
        {
          id: 6,
          image: "https://via.placeholder.com/150",
          title: "의류 상품 1",
          price: "15,000",
          likes: 20,
          location: "광주",
          date: "2024-11-06",
          category: "의류",
          subCategory: "상의",
        },
        {
          id: 7,
          image: "https://via.placeholder.com/150",
          title: "전자기기 상품 3",
          price: "50,000",
          likes: 35,
          location: "대전",
          date: "2024-11-07",
          category: "전자기기",
          subCategory: "가전제품",
        },
        {
          id: 8,
          image: "https://via.placeholder.com/150",
          title: "생활용품 상품 2",
          price: "10,000",
          likes: 8,
          location: "울산",
          date: "2024-11-08",
          category: "생활용품",
          subCategory: "청소용품",
        },
        {
          id: 9,
          image: "https://via.placeholder.com/150",
          title: "가구 상품 2",
          price: "60,000",
          likes: 22,
          location: "부산",
          date: "2024-11-09",
          category: "가구",
          subCategory: "소파",
        },
        {
          id: 10,
          image: "https://via.placeholder.com/150",
          title: "서적 상품 2",
          price: "12,000",
          likes: 15,
          location: "세종",
          date: "2024-11-10",
          category: "서적",
          subCategory: "교재",
        },
        {
          id: 11,
          image: "https://via.placeholder.com/150",
          title: "의류 상품 2",
          price: "25,000",
          likes: 28,
          location: "제주",
          date: "2024-11-11",
          category: "의류",
          subCategory: "하의",
        },
        {
          id: 12,
          image: "https://via.placeholder.com/150",
          title: "전자기기 상품 4",
          price: "100,000",
          likes: 40,
          location: "서울",
          date: "2024-11-12",
          category: "전자기기",
          subCategory: "태블릿",
        },
        {
          id: 13,
          image: "https://via.placeholder.com/150",
          title: "전자기기 상품 5",
          price: "150,000",
          likes: 50,
          location: "부산",
          date: "2024-11-13",
          category: "전자기기",
          subCategory: "노트북",
        },
        {
          id: 14,
          image: "https://via.placeholder.com/150",
          title: "생활용품 상품 3",
          price: "8,000",
          likes: 5,
          location: "광주",
          date: "2024-11-14",
          category: "생활용품",
          subCategory: "욕실용품",
        },
        {
          id: 15,
          image: "https://via.placeholder.com/150",
          title: "가구 상품 3",
          price: "70,000",
          likes: 15,
          location: "울산",
          date: "2024-11-15",
          category: "가구",
          subCategory: "책상",
        },
        {
          id: 16,
          image: "https://via.placeholder.com/150",
          title: "서적 상품 3",
          price: "10,000",
          likes: 8,
          location: "대전",
          date: "2024-11-16",
          category: "서적",
          subCategory: "기타",
        },
        {
          id: 17,
          image: "https://via.placeholder.com/150",
          title: "의류 상품 3",
          price: "30,000",
          likes: 18,
          location: "대구",
          date: "2024-11-17",
          category: "의류",
          subCategory: "코트",
        },
      ];
        this.currentPage = 1; // 새로운 데이터를 가져오면 첫 페이지로 초기화
      } catch (error) {
        console.error("게시물 데이터를 가져오는 중 오류 발생:", error);
      }
    },

    // 정렬 버튼 클릭 시 요청
    setSortOption(option) {
      this.sortOption = option; // 선택한 정렬 옵션 설정
      this.fetchPosts(); // 백엔드에 요청하여 데이터 가져오기
    },

    // 페이지 변경 시 요청
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
  mounted() {
    this.fetchPosts(); // 컴포넌트가 로드될 때 게시물 데이터 가져오기
  },
};
</script>


<style scoped>
#app {
  font-family: Arial, sans-serif;
  max-width: 1024px;
  margin: 0 auto;
  padding: 20px;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.product-image img {
  max-width: 100%;
  height: auto;
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


