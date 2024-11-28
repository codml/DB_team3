<template>
  <div class="main">
    <h1>메인페이지입니다.</h1>
  </div>
  <div class="search-container">
    <h1>특정 장소 검색</h1>
    <input
      type="text"
      v-model="searchQuery"
      placeholder="검색어를 입력하세요"
      @keyup.enter="searchPlace"
    />
    <button @click="searchPlace">검색</button>
  </div>
  <div class="map-container">
    <div id="map" style="width: 75%; height: 400px;"></div>
  </div>
</template>

<script>
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const NAVER_CLIENT_ID = process.env.VUE_APP_NAVER_CLIENT_ID;

// selint error 해결
/* eslint-disable */

export default {
  data() {
    return {
      searchQuery: '', // 검색어
      map: null, // 지도 객체
      markers: [], // 마커 객체 리스트
    };
  },
  beforeMount() {
    // 네이버 지도 스크립트를 렌더링 전에 로드합니다.
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_CLIENT_ID}`;
    script.onload = this.initMap;
    script.onerror = () => {
      console.error('네이버 지도 스크립트 로드 실패');
      alert('네이버 지도 스크립트 로드 중 문제가 발생했습니다.');
    };
    document.head.appendChild(script);
  },
  methods: {
    // 지도 초기화
    async initMap() {
      let initLocation = null;
      let x = 0, y = 0;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          x = 37.619897;
          y = 127.059542;
          initLocation = { x, y };
        } else {
          const decoded = jwtDecode(token);
          const response = await axios.get('http://localhost:3000/userLocation', {
            params: { user: decoded.userID },
          });
          const userLocation = response.data;
          console.log(response.data.userLocation)
          this.searchQuery = userLocation;
          x = userLocation.X;
          y = userLocation.Y;
          initLocation = { x, y };
        }
      } catch (error) {
        console.error('위치 정보를 로드하는 중 오류 발생:', error.message);
        // 기본 위치 설정 (광운대학교)
        initLocation = { x: 37.619897, y: 127.059542 };
      }

      if (typeof naver !== 'undefined') {
        this.map = new naver.maps.Map('map', {
          center: new naver.maps.LatLng(initLocation.x, initLocation.y),
          zoom: 10,
        });

        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(initLocation.x, initLocation.y),
          map: this.map,
        });

        // 줌 레벨을 설정
        this.map.setZoom(17);
      } else {
        console.error('네이버 지도 API 로드 실패');
        alert('네이버 지도 API 로드 실패');
      }
    },

    // 장소 검색 및 마커 표시
    async searchPlace() { 
      if (!this.searchQuery.trim()) return alert('검색어를 입력하세요.');

      try {
        const response = await axios.post('http://localhost:3000/map', {
          query: this.searchQuery.trim(),
        });

        const places = response.data.items;

        // 이전 마커 제거
        this.clearMarkers();

        // 마커 추가
        places.forEach((place) => {
          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(
              parseFloat(place.mapy),
              parseFloat(place.mapx)
            ),
            map: this.map,
            title: place.title.replace(/<[^>]+>/g, ''), // 태그 제거
          });

          // 마커 클릭 이벤트
          naver.maps.Event.addListener(marker, 'click', () => {
            alert(`${place.title.replace(/<[^>]+>/g, '')}\n주소: ${place.address}`);
          });

          this.markers.push(marker);
        });

        // 지도 중심을 첫 번째 검색 결과로 이동하고 줌 레벨 설정
        if (places.length > 0) {
          const firstPlace = places[0];
          const latLng = new naver.maps.LatLng(
            parseFloat(firstPlace.mapy),
            parseFloat(firstPlace.mapx)
          );

          this.map.setCenter(latLng);
          this.map.setZoom(17);
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
};
</script>

<style scoped>
.search-container {
  text-align: center; /* 검색 입력창을 중앙 정렬 */
  margin-bottom: 5px; /* 검색창과 지도 사이 간격 */
}

.map-container {
  display: flex;
  justify-content: center;  /* 수평 가운데 정렬 */
  align-items: center;      /* 수직 가운데 정렬 */
  height: 450px;            /* 화면 전체 높이 사용 */
}

#map {
  width: 75%; /* 맵의 너비 75% */
  height: 400px; /* 맵의 높이 400px */
}
</style>