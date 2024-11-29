<template>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else id="app">
        <!-- 메인 섹션 -->
        <main class="main-content">
            <!-- 마이페이지 메뉴 -->
            <aside class="sidebar">
                <ul>
                    <li @click="$router.push('/mypage')">나의 정보 보기</li>
                    <li @click="$router.push('/mypage/sale')">나의 판매 내역</li>
                    <li @click="$router.push('/mypage/purchase')">나의 구매 내역</li>
                    <li @click="$router.push('/mypage/like')">내가 찜한 상품</li>
                </ul>
            </aside>

            <!-- 프로필과 내가 판매한 상품을 상하로 배치 -->
            <div class="profile-and-products">
				<!-- 사용자 상세정보 -->
                <section class="profile" v-if="detail">
                    <h2>사용자 프로필</h2>
                    <div class="profile-box">
                        사용자 프로필
                    </div>
                </section>

                <section class="my-products">
                    <h2>신고 당한 사용자</h2>
					<!-- Table for posts -->
					<section class="profile">
						<h2>사용자 프로필 수정</h2>
						<div class="profile-box">
							사용자 프로필
						</div>
					</section>
					<table class="item-table">
						<thead>
							<tr>
								<th class="title-column">아이디</th>
								<th class="price-column">신고 횟수</th>
								<th class="date-column">평균 평판</th>
							</tr>
						</thead>
						<tbody>
							<tr v-if="!items">
								<td class="item-title">신고가</td>
								<td class="item-price">존재하지</td>
								<td class="post-time">않습니다</td>
							</tr>
							<tr v-else
								v-for="(report, index) in paginatedPosts"
								:key="index"
								:class="{ notice: report.Id !== null }" 
								@click="detail = true"
							>
								<td class="item-title">
									<a href="#">
										{{ report.Id }}
									</a>
								</td>
								<td class="item-price">{{ report.Rp_cnt }}</td>
								<td class="post-time">{{ report.Avg_rating }}</td>
							</tr>
						</tbody>
					</table>
                </section>

				<div class="pagination">
					<p>페이지 {{ currentPage }} / {{ totalPages }}</p>
					<button
						class="pagination-button"
						@click="prevPage"
						:disabled="currentPage === 1"
					>
						이전 페이지
					</button>
					<button
						class="pagination-button"
						@click="nextPage"
						:disabled="currentPage === totalPages"
					>
						다음 페이지
					</button>
				</div>
            </div>
        </main>
    </div>
</template>


<script>
import axios from "axios";

export default {
	props: ["page"],
	data() {
		return {
			// 사용자 데이터 저장
			reports: [],
			itemsPerPage: 5, // 페이지당 항목 수

			detail: false,		// 사용자 상세정보
			loading: true,      // 로딩 상태
			error: null         // 에러 메시지
		};
	},
  
	mounted() {
		// Axios GET 요청
		const token = localStorage.getItem('token'); // 토큰을 로컬 스토리지에서 가져오기

		axios.get('http://localhost:3000/mypage/manage', {
			headers: {
				Authorization: `Bearer ${token}` // 인증 헤더 설정
			}
		})
		.then(response => {
			this.items = response.data.reports; // 응답 데이터에서 사용자 정보 저장
			console.log('reports: '+ JSON.stringify(this.reports));
		})
		.catch(err => {
			console.error('Error fetching MyPage data:', err);
			if(err.response.data.message === 'Item not exists')
				this.error = null;
			else if (err.response && err.response.data) {
				this.error = err.response.data.message || 'Failed to load data';
			} else {
				this.error = 'An unexpected error occurred';
			}
		})
		.finally(() => {
			this.loading = false; // 로딩 상태 종료
		});
	},

	computed: {
		currentPage() {
			return parseInt(this.page) || 1;
		},
		totalPages() {
			return Math.ceil(this.reports.length / this.itemsPerPage) || 1;
		},
		paginatedPosts() {
			const start = (this.currentPage - 1) * this.itemsPerPage;
			const end = start + this.itemsPerPage;
			return this.reports.slice(start, end);
		},
	},

	methods:{
		formatDate(dateString) {
			if (!dateString) return "N/A";
			const date = new Date(dateString);
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
				2,
				"0"
			)}-${String(date.getDate()).padStart(2, "0")} ${String(
				date.getHours()
			).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
		},
		nextPage() {
			if (this.currentPage < this.totalPages) {
				this.$router.push({
					name: "mylike",
					params: { page: this.currentPage + 1 },
				});
			}
		},
		prevPage() {
			if (this.currentPage > 1) {
				this.$router.push({
					name: "mylike",
					params: { page: this.currentPage - 1 },
				});
			}
		},
		goToViewPost(item) {
			this.$router.push({
				name: "read",
				params: { ino: item.Ino }
			});
		},
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



.item-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.item-table th,
.item-table td {
  border: 1px solid #ccc;
  padding: 10px;
}

.item-table th.image-column {
  width: 10%; /* 제목 칸 */
  text-align: center; /* 가운데 정렬 */
}

.item-table th.title-column {
  width: 40%; /* 제목 칸 */
  text-align: center; /* 가운데 정렬 */
}

.item-table th.price-column {
  width: 20%; /* 가격 칸 */
  text-align: center; /* 가운데 정렬 */
}

.item-table th.date-column {
  width: 30%; /* 작성일 칸 */
  text-align: center; /* 가운데 정렬 */
}

.item-table td.item-title {
  text-align: left;
}

.item-table td.item-price {
  text-align: center; /* 가운데 정렬 */
}

.item-table td.post-time {
  text-align: center; /* 가운데 정렬 */
}

.item-table tr {
  transition: background-color 0.3s ease;
}

.item-table tr:hover {
  background-color: #f1f1f1; /* 호버 시 더 밝은 색상 */
}

.item-table tr.notice {
  font-weight: bold; /* 공지사항 굵은 글씨 */
  background-color: #f9f9f9; /* 공지사항 배경색 */
}

.item-table tr.notice td {
  font-weight: bold; /* 공지사항의 모든 열 굵게 */
  color: #333; /* 텍스트 색상 */
}

.item-image img{
  width: 50px; /* 가로 크기를 200px로 설정 */
  height: 50px; /* 세로 크기를 150px로 설정 */
  object-fit: cover; /* 이미지 비율을 유지하면서 영역을 채움 */
  border-radius: 10px; /* 모서리를 둥글게 처리 */
}

.item-title a {
  text-decoration: none; /* 제목 밑줄 제거 */
  color: black; /* 제목 색상 검정으로 설정 */
  cursor: pointer;
}

.item-title a:hover {
  text-decoration: underline; /* 제목에 마우스 호버 시 밑줄 추가 */
}

.notice-badge {
  color: red;
  font-weight: bold;
  margin-right: 5px;
}

.pagination {
  text-align: center;
  margin-top: 20px;
}

.pagination-button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;
}

.pagination-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination-button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;
}

.pagination-button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}
</style>
