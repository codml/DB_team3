<template>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else id="app">
        <!-- 메인 섹션 -->
        <main class="main-content">
            <!-- 마이페이지 메뉴 -->
            <aside class="sidebar">
                <ul>
                    <li @click="$router.push('/mypage/edit')">나의 정보 보기</li>
                    <li @click="$router.push('/mypage/sale')">나의 판매 내역</li>
                    <li @click="$router.push('/mypage/purchase')">나의 구매 내역</li>
                    <li @click="$router.push('/mypage/likelist')">내가 찜한 상품</li>
                </ul>
            </aside>

            <!-- 프로필과 내가 판매한 상품을 상하로 배치 -->
            <div class="profile-and-products">
                <section class="profile">
                    <h2>사용자 프로필 수정</h2>
                    <div class="profile-box">
                        사용자 프로필
                    </div>
                </section>

                <section class="my-products">
                    <h2>내가 판매한 상품</h2>
                    <div class="product-list">
                        <div class="product">내가 판매한 상품 정보</div>
                        <div class="product">내가 판매한 상품 정보</div>
                        <div class="product">내가 판매한 상품 정보</div>
                        <div class="product">내가 판매한 상품 정보</div>
                    </div>
                </section>
            </div>
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

/* 프로필 및 상품 상하 배치 */
.profile-and-products {
    flex: 1;
    display: flex;
    flex-direction: column; /* 상하 배치 */
    gap: 30px; /* 프로필과 상품 간격 */
}

/* 프로필 섹션 스타일 */
.profile {
    border: 1px solid #ddd;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile h2 {
    font-size: 18px;
    margin-bottom: 10px;
}

.profile-box {
    text-align: center;
    font-size: 16px;
    color: #666;
}

/* 내가 판매한 상품 스타일 */
.my-products {
    border: 1px solid #ddd;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.my-products h2 {
    font-size: 18px;
    margin-bottom: 10px;
}

.my-products .product-list {
    display: grid;
    grid-template-columns: 1fr; /* 한 열에 하나씩 배치 */
    gap: 15px;
}

.my-products .product {
    border: 1px solid #ddd;
    padding: 20px;
    background-color: #fff;
    text-align: center;
    font-size: 16px;
    color: #333;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
}

.my-products .product:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

</style>
