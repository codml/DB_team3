<template>
	<div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
	<div v-else id="app">
		<!-- 메인 섹션 -->
		<main class="main-content">
			<!-- 마이페이지 메뉴 -->
			<aside class="sidebar">
				<ul>
					<li @click="$router.push('/mypage/edit')">나의 정보 수정</li>
					<li @click="$router.push('/mypage/sale')">나의 판매 내역</li>
					<li @click="$router.push('/mypage/purchase')">나의 구매 내역</li>
					<li @click="$router.push('/mypage/like')">내가 찜한 상품</li>
					<li v-if="user.Auth" @click="$router.push('/mypage/manage')">사용자 관리</li>
				</ul>
			</aside>


			<!-- 사용자 프로필 -->
			<section class="profile">
				<h2>사용자 프로필</h2>
				<div class="profile-content">
					<div class="profile-left">
						<!-- 사용자 추가 정보 -->
						<p><strong>아이디:</strong> {{ user.Id || '정보 없음' }}</p>
						<p><strong>비밀번호:</strong> {{ user.Passwd || '정보 없음' }}</p>
						<p><strong>이름:</strong> {{ user.Uname || '정보 없음' }}</p>
						<p><strong>닉네임:</strong> {{ user.Nickname || '정보 없음' }}</p>
						<p><strong>나이:</strong> {{ user.Age || '정보 없음' }}</p>
						<p><strong>성별:</strong> {{ user.Sex || '정보 없음' }}</p>
						<p><strong>전화번호:</strong> {{ user.Phone || '정보 없음' }}</p>
						<p><strong>이메일:</strong> {{ user.Email || '정보 없음' }}</p>
						<p><strong>주소:</strong> {{ user.Address || '정보 없음' }}</p>
					</div>
					<div class="profile-right">
						<!-- 이미지 출력 -->
						<div class="profile-image-wrapper">
							<img 
								v-if="user.Profile_image" 
								:src="`data:image/jpeg;base64,${user.Profile_image}`" 
								alt="Image from server"
							/>
							<p v-else>이미지가 없습니다</p>
						</div>
					</div>
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
			// 사용자 데이터 저장
			user: {
				Uname: null,
				Age: null,
				Sex: null,
				Phone: null,
				Email: null,
				Address: null,
				Id: null,
				Passwd: null,
				Auth: null,
				Nickname: null,
				Profile_image: null,
				Rp_cnt: null,
				Rating_cnt: null,
				Avg_rating: null
			},
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
  display: flex;
  gap: 20px;
  align-items: center;
  height: 300px; /* 프로필 영역 높이 설정 */
}

.profile-left {
  flex: 1;
}

.profile-right {
  flex: 0 0 50%; /* 프로필 오른쪽 크기를 설정 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-image-wrapper {
  width: 80%; /* profile-content의 절반 정도 크기로 설정 */
  padding-top: 80%; /* 1:1 비율 유지 */
  position: relative;
  overflow: hidden;
  border-radius: 15px; /* 모서리를 둥글게 처리 */
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 비율을 유지하며 이미지를 채움 */
  border-radius: 15px;
}

</style>
