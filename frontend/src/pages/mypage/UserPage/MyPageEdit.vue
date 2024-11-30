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


		<!-- 사용자 프로필 -->
		<section class="profile">
			<h2>사용자 프로필 수정</h2>
			<div class="profile-content">
				<div class="profile-left">
					<!-- 사용자 추가 정보 -->
					<label>
						<strong>아이디:</strong>
						<input type="text" v-model="user.Id" disabled />
					</label>
					<label>
						<strong>비밀번호:</strong>
						<input type="password" v-model="user.Passwd" required/>
					</label>
					<label>
						<strong>이름:</strong>
						<input type="text" v-model="user.Uname" required/>
					</label>
					<label>
						<strong>닉네임:</strong>
						<input type="text" v-model="user.Nickname" />
					</label>
					<label>
						<strong>나이:</strong>
						<input type="number" v-model="user.Age" required/>
					</label>
					<label>
						<strong>성별:</strong>
						<select v-model="user.Sex" required >
						<option value="남">남성</option>
						<option value="여">여성</option>
						</select>
					</label>
					<label>
						<strong>전화번호:</strong>
						<input type="text" v-model="user.Phone" required/>
					</label>
					<label>
						<strong>이메일:</strong>
						<input type="email" v-model="user.Email" required/>
					</label>
					<label>
						<strong>주소:</strong>
						<input type="text" v-model="user.Address" required/>
					</label>
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
					<!-- 이미지 변경 -->
					<div class="form-group">
						<label>프로필 이미지 변경:</label>
						<input type="file" @change="onImageChange" accept="image/*" />
						<img 
							v-if="new_image" 
							:src="`data:image/jpeg;base64,${new_image}`" 
							alt="Image from local"
						/>
					</div>
				</div>
			</div>
			<button class="save-button" @click="saveProfile">프로필 저장</button>
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
			new_image: null,
			
			
			loading: true,      // 로딩 상태
			error: null,        // 에러 메시지
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
	},

	methods: {
		// 폼 유효성 검사
		validateForm() {
			const requiredFields = ["Passwd", "Uname", "Age", "Sex", "Phone", "Email", "Address"];
			for (const field of requiredFields) {
				if (!this.user[field]) {
					alert(`${field}를(을) 입력해주세요.`);
					return false;
				}
			}
			return true;
		},
		onImageChange(event) {
			this.new_image = event.target.files[0];
		},

		async saveProfile() {
			if (!this.validateForm()) {
				return; // 유효성 검사를 통과하지 못하면 서버로 요청하지 않음
			}
			
			const formData = new FormData();

			// 사용자 데이터를 FormData에 추가
			for (const key in this.user) {
				if (key === "Profile_image") {
					if(this.new_image)
						formData.append(key, this.new_image); // 이미지 파일
					else
						formData.append(key, ''); // 이미지 파일
				} else {
					formData.append(key, this.user[key]); // 일반 필드
				}
			}

			try {
				const response = await axios.post("http://localhost:3000/mypage", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});

				alert('업데이트 성공');
				console.log("업데이트 성공:", response.data);
				this.$router.push('/mypage')
			} catch (error) {
				alert('업데이트 실패');
				console.error("업데이트 실패:", error.response?.data || error.message);
			}
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
  padding-bottom: 50px; /* 아래쪽 여백 추가 */
  border: solid black;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-family: Avenir, Helvetica, Arial, sans-serif;
  min-height: 100vh; /* 최소 높이 설정으로 하단 공간 확보 */
  display: flex;
  flex-direction: column; /* 내용물 정렬 */
}

/* 메인 컨텐츠 스타일 */
.main-content {
  display: flex;
  padding: 20px;
  margin-top: 20px; /* 메뉴바와 메인 컨텐츠 사이 간격 추가 */
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
  align-items: flex-start;
}

.profile-left {
  flex: 1;
}

.profile-right {
  flex: 0 0 40%; /* 프로필 이미지 영역 크기 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-image-wrapper {
  width: 100%;
  padding-top: 100%; /* 1:1 비율 유지 */
  position: relative;
  overflow: hidden;
  border-radius: 15px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px; /* 이미지와 버튼 간격 추가 */
}

.profile-image-wrapper img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지 비율 유지 */
  border-radius: 15px;
}

.form-group {
  margin-bottom: 15px;
  width: 100%; /* 입력 필드가 프로필 박스 내에서 고정된 너비를 가짐 */
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select {
  width: 100%;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

button.save-button {
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  align-self: flex-start;
}

button.save-button:hover {
  background-color: #0056b3;
}


</style>
