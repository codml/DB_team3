<template>
	<div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
	<div v-else id="app">
		<!-- 메인 섹션 -->
		<main class="main-content">
		<!-- 마이페이지 메뉴 -->
		<aside class="sidebar">
			<ul>
			<li @click="navigate('회원정보수정')">회원정보수정</li>
			<li @click="navigate('나의 판매 내역')">나의 판매 내역</li>
			<li @click="navigate('나의 구매 내역')">나의 구매 내역</li>
			<li @click="navigate('내가 찜한 상품')">내가 찜한 상품</li>
			</ul>
		</aside>


		<!-- 사용자 프로필 -->
		<section class="profile">
			<h2>사용자 프로필</h2>
			<div class="profile-content">
				<!-- 이미지 출력 -->
				<img v-if="user.Profile_image"  :src="`data:image/jpeg;base64,${user.Profile_image}`" alt="Image from server" />
				<p v-else>이미지가 없습니다</p>
			</div>
		</section>
		</main>
	</div>
</template>

<script>
import axios from "axios";

export default {
	data() {
		return {
			user: null,         // 사용자 데이터 저장
			loading: true,      // 로딩 상태
			error: null         // 에러 메시지
		};
	},
  
	mounted() {
		// Axios GET 요청
		const token = localStorage.getItem('token'); // 토큰을 로컬 스토리지에서 가져오기

		axios.get('http://localhost:3000/mypage', {
			headers: {
				Authorization: `Bearer ${token}` // 인증 헤더 설정
			}
		})
		.then(response => {
			this.user = response.data.user; // 응답 데이터에서 사용자 정보 저장
		})
		.catch(err => {
			console.error('Error fetching MyPage data:', err);
			if (err.response && err.response.data) {
				this.error = err.response.data.message || 'Failed to load data';
			} else {
				this.error = 'An unexpected error occurred';
			}
		})
		.finally(() => {
			this.loading = false; // 로딩 상태 종료
		});
	}
};
</script>

<style scoped>
/* 전체 레이아웃 */
#app {
    width: 960px;
  margin: 0 auto;
  padding: 20px;
  border: solid black;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

/* 메인 컨텐츠 스타일 */
.main-content {
  display: flex;
  padding: 20px;
}

/* 사이드바 스타일 */
.sidebar {
  width: 200px;
  margin-right: 20px;
  border-right: 1px solid #ccc;
  padding-right: 10px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin-bottom: 10px;
  cursor: pointer;
  font-size: 16px;
}

/* 프로필 섹션 스타일 */
.profile {
  flex: 1;
}

.profile h2 {
  margin-top: 0;
}

.profile-content {
  border: 1px solid #ccc;
  padding: 20px;
  height: 300px;
}
</style>
