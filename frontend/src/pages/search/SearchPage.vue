<template>
  <div id="app">
    <main>
      <section class="search-section">
        <h2>검색 필터</h2>
        <div class="search-bar">
          <input
            type="text"
            placeholder="검색할 상품을 입력하세요"
            v-model="searchQuery"
          />
          <button @click="searchProducts">🔍</button>
        </div>
      </section>

      <section class="filter-buttons">
        <button>찜 많은 순</button>
        <button>최신 순</button>
        <button>조회수 많은 순</button>
      </section>

      <section class="product-grid">
        <div
          v-for="product in products"
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
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      products: [
        {
          id: 1,
          image: "https://via.placeholder.com/150",
          title: "상품 제목 1",
          price: "10,000",
          likes: 15,
          location: "서울",
          date: "2024-11-01",
          category: "전자기기",
        },
        {
          id: 2,
          image: "https://via.placeholder.com/150",
          title: "상품 제목 2",
          price: "20,000",
          likes: 22,
          location: "부산",
          date: "2024-11-02",
          category: "생활용품",
        },
        {
          id: 3,
          image: "https://via.placeholder.com/150",
          title: "상품 제목 3",
          price: "30,000",
          likes: 8,
          location: "대전",
          date: "2024-11-03",
          category: "가구",
        },
        {
          id: 4,
          image: "https://via.placeholder.com/150",
          title: "상품 제목 4",
          price: "5,000",
          likes: 11,
          location: "인천",
          date: "2024-11-04",
          category: "서적",
        },
        {
          id: 5,
          image: "https://via.placeholder.com/150",
          title: "상품 제목 5",
          price: "15,000",
          likes: 19,
          location: "대구",
          date: "2024-11-05",
          category: "의류",
        },
        {
          id: 6,
          image: "https://via.placeholder.com/150",
          title: "상품 제목 6",
          price: "40,000",
          likes: 5,
          location: "광주",
          date: "2024-11-06",
          category: "전자기기",
        },
        {
          id: 7,
          image: "https://via.placeholder.com/150",
          title: "상품 제목 7",
          price: "70,000",
          likes: 25,
          location: "울산",
          date: "2024-11-07",
          category: "생활용품",
        },
      ],
    };
  },
  methods: {
    searchProducts() {
      alert(`"${this.searchQuery}"로 검색 요청을 보냈습니다.`);
      // 여기에 서버로 검색 요청을 보내는 로직을 추가하세요.
    },
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

.search-section {
  margin-top: 20px;
  text-align: center;
}

.search-bar {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.search-bar input {
  width: 60%;
  padding: 10px;
  margin-right: 5px;
}

.search-bar button {
  padding: 10px;
}

.filter-buttons {
  text-align: center;
  margin: 20px 0;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
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

.product-info h3 {
  font-size: 1.2em;
  margin: 10px 0;
}

.product-info p {
  font-size: 0.9em;
}
</style>
