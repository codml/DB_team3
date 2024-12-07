<template>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else id="app">
        <!-- 메인 섹션 -->
        <main class="main-content">
            <!-- 프로필과 내가 판매한 상품을 상하로 배치 -->
            <div class="profile-and-products">
				<!-- 사용자 상세정보 -->
                <section class="my-products" >
                    <h2>신고 당한 사용자</h2>
					<!-- Table for posts -->
					<section class="profile" v-if="detail">
						<div class="cancelBtn">
							<button class="btn" @click="detail=false">X</button>
						</div>
						<div class="detail">
							<div class="profile-image">
								<img 
									v-if="user.Profile_image" 
									:src="`data:image/jpeg;base64,${user.Profile_image}`" 
									alt="Image from server"
								/>
							</div>
							<div class="profile-box">
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
						</div>
						<button @click="banUser(user.Id); getRpUserList();detail=false;">회원 탈퇴</button>
					</section>
					<table v-if="!detail" class="item-table">
						<thead>
							<tr>
								<th class="title-column">아이디</th>
								<th class="price-column">신고 횟수</th>
								<th class="date-column">평균 평판</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(report, index) in paginatedPosts"
								:key="index"
								:class="{ notice: report.Id !== null }" 
								@click="getRpUser(report.Id); getRpList(report.Id);"
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
					<table v-else class="item-table">
						<thead>
							<tr>
								<th class="title-column">제목</th>
								<th class="price-column">등록 날짜</th>
								<th class="date-column">신고 횟수</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(list, index) in lists"
								:key="index"
								:class="{ notice: user.Id !== null }"
								@click="goToView(list.Ino)"
							>
								<td class="item-title">
									<a href="#">
										{{ list.Title }}
									</a>
								</td>
								<td class="item-price">{{ formatDate(list.Reg_date) }}</td>
								<td class="post-time">{{ list.Report_cnt }}</td>
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
			reports: [], // 신고 받은 유저 리스트
			user: [], // 신고 받은 유저
			lists: [], // 신고 받은 유저글
			itemsPerPage: 5, // 페이지당 항목 수

			detail: false,		// 사용자 상세정보
			loading: true,      // 로딩 상태
			error: null         // 에러 메시지
		};
	},
  
	mounted() {
		this.getRpUserList();
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

		getRpUserList() {
			// Axios GET 요청
			const token = localStorage.getItem('token'); // 토큰을 로컬 스토리지에서 가져오기

			axios.get('http://localhost:3000/mypage/manage', {
				headers: {
					Authorization: `Bearer ${token}` // 인증 헤더 설정
				}
			})
			.then(response => {
				this.reports = response.data.reports; // 응답 데이터에서 사용자 정보 저장
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

		getRpUser(Id) {			
			axios.get('http://localhost:3000/mypage/manage/detail', {
				headers: {
					Id: Id // 인증 헤더 설정
				}
			})
			.then(response => {
				this.user = response.data.user; // 응답 데이터에서 사용자 정보 저장
				console.log('user: '+ JSON.stringify(this.user));
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
				this.detail = true;
			})
		},

		getRpList(Id) {			
			axios.get('http://localhost:3000/mypage/manage/list', {
				headers: {
					Id: Id // 인증 헤더 설정
				}
			})
			.then(response => {
				this.lists = response.data.lists; // 응답 데이터에서 사용자 정보 저장
				console.log('lists: '+ JSON.stringify(this.lists));
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
				this.detail = true;
			})
		},

		async banUser(Id) {			
			try {
				const response = await axios.delete('http://localhost:3000/mypage/manage/ban', {
					data: { Id: Id }, // 삭제 시 추가로 전송할 데이터
				});
				console.log('삭제 성공:', response.data);
				alert('삭제 성공');
			} catch (error) {
				console.error('삭제 실패:', error);
				alert('삭제 실패');
			}
		},

		goToView(Ino) {
			this.$router.push({
				name: "read",
				params: { ino: Ino }
			});
		}
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

.cancelBtn {
  display: flex; /* Flexbox 활성화 */
  justify-content: flex-end; /* 오른쪽 정렬 */
  padding: 20px; /* 선택적으로 여백 추가 */
}
.btn {
  padding: 10px 20px;
  font-size: 16px;
}

.detail {
	display: flex; /* Flexbox를 활성화 */
	gap: 10px;     /* 두 요소 간의 간격 설정 (선택 사항) */
}

.profile-image {
	display: flex; /* Flexbox 활성화 */
	width: 300px;
	align-items: center; /* 세로 중앙 정렬 */
	justify-content: center; /* 가로 중앙 정렬 (선택 사항) */
}

.profile-box {
    text-align: left;
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
  text-align: center;
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
