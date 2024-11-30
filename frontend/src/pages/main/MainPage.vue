<template>
  <div class="main">
    <h1>추천 상품</h1>
    <section class="product-grid">
      <!-- 상품이 있을 때 -->
      <template v-if="posts.length > 0">
        <div
          v-for="(product, index) in posts"
          :key="index"
          class="product-card"
          @click="redirectToRead(product.Ino)"
        >
          <!-- 상품 이미지 -->
          <div class="product-image">
            <img
              v-if="product.Image"
              :src="`data:image/jpeg;base64,${product.Image}`"
              alt="상품 이미지"
            />
            <div v-else class="no-image">이미지 없음</div>
          </div>

          <!-- 상품 정보 -->
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

      <!-- 상품이 없을 때 -->
      <div v-else class="no-posts">
        게시물이 없습니다.
      </div>
    </section>
  </div>

  <div class="search-container">
    <h1>내 주변의 판매 상품 보기</h1>
    <input
      type="text"
      v-model="searchQuery"
      placeholder="주소를 입력하세요"
      @keyup.enter="searchPlace"
    />
    <button @click="searchPlace">검색</button>
  </div>
  <div class="map-container">
    <div id="map"></div>
  </div>
</template>

<script>
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

let initLocation = null;
let X = 0, Y = 0;

const NAVER_CLIENT_CLOUD_ID = process.env.VUE_APP_NAVER_CLIENT_CLOUD_ID;

// selint error 해결
/* eslint-disable */

export default {
  computed: {
    // 현재 페이지에 맞는 상품 데이터 계산
    posts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return Array.isArray(this.allPosts) ? this.allPosts.slice(start, end) : [];
    },
  },
  data() {
    return {
      /* 상품 보여주기 */
      mainCategory: "",
      subCategory: "",
      priceFrom: null,
      priceTo: null,
      searchQuery: "",
      sortOption: "찜 많은 순",
      itemsPerPage: 6, // 한 페이지에 표시할 게시물 수
      allPosts: [], // 전체 게시물 데이터를 저장
      currentPage: 1, // 현재 페이지 번호

      /* 지도 API */
      searchQuery: '', // 검색어
      map: null, // 지도 객체
      markers: [], // 마커 객체 리스트
    };
  },
  beforeMount() {
    // 네이버 지도 스크립트를 렌더링 전에 로드합니다.
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_CLIENT_CLOUD_ID}`;
    script.onload = this.initMap;
    script.onerror = () => {
      console.error('네이버 지도 스크립트 로드 실패');
      alert('네이버 지도 스크립트 로드 중 문제가 발생했습니다.');
    };
    document.head.appendChild(script);
  },
  methods: {
    /* 메인페이지 상품 보여주기 */
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
    // 클릭 시 상세 페이지로 이동
    redirectToRead(ino) {
      this.$router.push(`/read/${ino}`);
    },
    // 날짜 포맷팅
    formatDate(dateString) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateString).toLocaleDateString("ko-KR", options);
    },
    
    /* 지도 API */
    // 지도 초기화
    async initMap() {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          X = 37.619897;
          Y = 127.059542;
          initLocation = { X, Y };
        } else {
          const decoded = jwtDecode(token);
          console.log(decoded)

          const userLocation = decoded.UserAddress;
          console.log(userLocation);

          const location = await axios.post('http://localhost:3000/map', {
            query: userLocation
          });

          console.log(location);

          const { x, y } = location.data.location[0];
          initLocation = { X: parseFloat(y), Y: parseFloat(x) }; // x: 경도, y: 위도
        }
      } catch (error) {
        console.error('위치 정보를 로드하는 중 오류 발생:', error.message);
        // 기본 위치 설정 (광운대학교)
        initLocation = { X: 37.619897, Y: 127.059542 };
      }

      if (typeof naver !== 'undefined') {
        this.map = new naver.maps.Map('map', {
          center: new naver.maps.LatLng(initLocation.X, initLocation.Y),
          zoom: 16,
        });

        // 줌 레벨을 설정
        this.map.setZoom(16);
      } else {
        console.error('네이버 지도 API 로드 실패');
        alert('네이버 지도 API 로드 실패');
      }

      // 주소 데이터가 제대로 반환됬는지 확인
      try {
        const itemLocations = await axios.get('http://localhost:3000/map'); // 상품 거래 장소 정보 받아오기
        console.log(itemLocations.data); // 응답 데이터를 확인

        //  지도에 상품의 마커 추가
        for (let location of itemLocations.data.location) {
          try {
            const { X, Y } = location; // 경도(x)와 위도(y) 정보 추출
            const { Address } = location;
            const { Ino, Title } = location;

            // 각 마커에 대해 고유한 infoWindow 생성
            const infoWindow = new naver.maps.InfoWindow({
              content: `
                <div>
                  <strong>주소:</strong> ${Address}<br><strong>제목:</strong> ${Title}
                </div>
              `,
              maxWidth: 300, // 최대 너비
            });

            // 마커를 지도에 추가
            const marker = new naver.maps.Marker({
              position: new naver.maps.LatLng(parseFloat(X), parseFloat(Y)),
              map: this.map,
            });

            // 마커에 mouseover 이벤트 추가. 마커에 마우스를 올렸을 때 정보 창을 보여줍니다.
            naver.maps.Event.addListener(marker, 'mouseover', () => {
              infoWindow.open(this.map, marker); // infoWindow 표시
            });

            // 마커에 mouseout 이벤트 추가. 마우스가 마커에서 벗어나면 정보창을 닫을지 여부를 판단
            naver.maps.Event.addListener(marker, 'mouseout', () => {
              infoWindow.close(); // 정보창 닫기
            });

            // 마커에 click 이벤트 추가. 마커를 클릭했을 때 URL로 이동
            naver.maps.Event.addListener(marker, 'click', () => {
              infoWindow.close(); // 정보창 닫기
              
              // 이동할 URL 설정 (예: `Ino`를 사용하여 URL 생성)
              const url = `http://localhost:8080/read/${Ino}`;
              
              // URL로 이동 (현재 창에서 이동)
              window.location.href = url;
            });

            this.markers.push(marker); // 마커 목록에 추가
          } catch (error) {
            console.error(`마커 추가 실패: ${error.message}`);
          }
        }
      } catch (error) {
          if (error.response && error.response.status === 404) {
              console.error('Error: Resource not found (404)');
          } else {
              console.error('Error:', error.message);
          }

          return;
      }
    },

    // 장소 검색
    async searchPlace() { 
      if (!localStorage.getItem('token')) {
        // 토큰이 없으면 로그인 페이지로 리디렉션
        if (confirm('로그인이 필요합니다. \n로그인 페이지로 이동하시겠습니까?')) {
          this.$router.push({ name: 'login' });  // '예' 선택 시 '/login'으로 이동
          return;
        } else {
          this.$router.push({ name: 'main' });   // '아니오' 선택 시 '/main'으로 이동
          return;
        }
      }
      
      if (!this.searchQuery.trim()) return alert('검색어를 입력하세요.');
      console.log(this.searchQuery);

      try {
        const response = await axios.post('http://localhost:3000/map/search', {
          query: this.searchQuery, // 검색어를 'query'라는 키로 서버에 전달
        });

        const places = response.data.items;

        console.log(places);

        if (places.length > 0) {
          const firstPlace = places[0];

          const latLng = new naver.maps.LatLng(
            parseFloat(firstPlace.mapy) / 1e7, // 위도 (mapy)
            parseFloat(firstPlace.mapx) / 1e7  // 경도 (mapx)
          );
          
          // 지도 중심을 검색 장소로 이동
          this.map.setCenter(latLng);
          // 줌 레벨을 설정
          this.map.setZoom(16);
        }
      } catch (error) {
        console.error('장소 검색 실패:', error.message);
        alert('검색 중 문제가 발생했습니다.');
      }
    },

    // 마커 제거
    clearMarkers() {
      this.markers.forEach((marker) => marker.setMap(null));
      this.markers = [];
    },
  },
  mounted() {
    this.fetchPosts();
  },
};
</script>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3개의 동일한 크기의 컬럼 */
  gap: 20px;
  margin-top: 20px;
  width: 65%; /* 전체 너비 사용 */
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
  width: 100%;
  min-width: 0; /* 그리드 아이템 오버플로우 방지 */
  transition: border-color 0.3s ease;
}

.product-card:hover {
  background-color: #42b983;
  border-color: #42b983;
  transition: 0.5s;
}

.product-image {
  width: 100%;
  aspect-ratio: 1; /* 정사각형 비율 유지 */
  overflow: hidden;
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

.no-posts {
  text-align: center;
  color: #666;
}

.search-container {
  text-align: center; /* 검색 입력창을 중앙 정렬 */
  margin-top: 50px;
  margin-bottom: 5px; /* 검색창과 지도 사이 간격 */
}

input[type="text"] {
  width: 300px; /* 너비 설정 */
  height: 50px; /* 높이 설정 */
  padding: 10px; /* 안쪽 여백 */
  font-size: 18px; /* 글자 크기 */
  border: 2px solid #ccc; /* 테두리 */
  border-radius: 5px; /* 모서리 둥글게 */
  box-sizing: border-box; /* 패딩 포함 크기 */
}

button {
  height: 50px; /* 버튼 높이 */
  margin-left: 10px;
  padding: 0 20px; /* 좌우 여백 */
  font-size: 18px; /* 글자 크기 */
  font-weight: bold; /* 글자 두께 */
  background-color: #42b983; /* 배경색 */
  color: #fff; /* 글자색 */
  border: none; /* 테두리 제거 */
  border-radius: 5px; /* 모서리 둥글게 */
  cursor: pointer; /* 클릭 가능 표시 */
}

.map-container {
  display: flex;
  justify-content: center;  /* 수평 가운데 정렬 */
  align-items: center;      /* 수직 가운데 정렬 */
  height: 450px;            /* 화면 전체 높이 사용 */
}

#map {
  width: 65%; /* 맵의 너비 65% */
  height: 400px; /* 맵의 높이 400px */
}
</style>