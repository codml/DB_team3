<template>
  <div class="request-page">
    <h1>구매 요청 페이지</h1>
    <div v-if="isLoading">로딩 중...</div>
    <div v-else>
      <!-- 요청 데이터가 있을 경우 -->
      <div v-if="requestData && requestData.length > 0 && !isOnlySellerId">
        <table class="request-table">
          <thead>
            <tr>
              <th>요청자 ID</th>
              <th>내용</th>
              <th>거래 방식</th>
              <th>위치</th>
              <th>전화번호</th>
              <th>연락 방법</th>
              <th>등록일</th>
              <th>삭제</th>
              <th v-if="isSeller">수락</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(request, index) in requestData" :key="index">
              <td>{{ request.R_uid }}</td>
              <td>{{ request.Content }}</td>
              <td>{{ request.Deal_way === 0 ? '직거래' : '택배 거래' }}</td>
              <td>{{ request.Location }}</td>
              <td>{{ request.Phone }}</td>
              <td>{{ request.Contact }}</td>
              <td>{{ formatDate(request.Reg_date) }}</td>
              <td>
                <button 
                  class="delete-button" 
                  @click="deleteRequest(request.R_uid)"
                >삭제</button>
              </td>
              <td v-if="isSeller">
                <button 
                  class="accept-button" 
                  @click="acceptRequest(request.R_uid)"
                >수락</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 요청 데이터가 비어 있고 S_uid가 로그인한 ID와 다를 경우 -->
      <div v-else-if="isOnlySellerId && !isSeller">
        <p>현재 요청된 데이터가 없습니다.</p>
        <div>
          <p>구매 요청을 보내보세요.</p>
          <div class="request-form">
            <textarea
              v-model="newRequest.content"
              placeholder="요청 내용을 입력하세요"
            ></textarea>
            <div class="form-fields">
              <label>
                거래 방식:
                <select v-model="newRequest.dealWay">
                  <option value="0">직거래</option>
                  <option value="1">택배 거래</option>
                </select>
              </label>
              <label>
                거래 지역:
                <input type="text" v-model="newRequest.location" />
              </label>
              <label>
                연락처:
                <input type="text" v-model="newRequest.phone" />
              </label>
              <label>
                연락 방법:
                <input type="text" v-model="newRequest.contact" />
              </label>
            </div>
            <button @click="sendRequest">요청 보내기</button>
          </div>
        </div>
      </div>

      <!-- 요청 데이터가 비어 있고 S_uid가 로그인한 ID와 같을 경우 -->
      <div v-else-if="isOnlySellerId && isSeller">
        <p>판매자는 자신에게 요청을 보낼 수 없습니다.</p>
      </div>

      <!-- 뒤로가기 버튼 -->
      <div class="back-button-container">
        <button @click="goBack">뒤로가기</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default {
  props: ["ino"],
  data() {
    return {
      requestData: null,
      userID: "",
      auth: "",
      sellerID: "",
      isLoading: true,
      isOnlySellerId: false, // S_uid만 있는 경우를 처리하기 위한 플래그
      isSeller: false,
      newRequest: {
        content: "",
        dealWay: "0",
        location: "",
        phone: "",
        contact: "",
      },
    };
  },
  computed: {
    // 접속 중인 사용자 ID가 판매자 ID와 같은지 확인
    isOwner() {
      return this.userID === this.sellerID;
    },
  },
  methods: {
    async fetchRequestData() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("토큰이 존재하지 않습니다.");
    }

    // 로그인한 사용자 정보 가져오기
    const user = jwtDecode(token);
    this.userID = user.userID;
    this.auth = user.auth;

    // 요청 데이터 가져오기
    const response = await axios.get(`http://localhost:3000/request/${this.ino}`, {
      params: { userId: this.userID },
      headers: { "Cache-Control": "no-cache" },
    });

    if (Array.isArray(response.data)) {
      this.requestData = response.data;

      // S_uid만 포함된 요청인지 확인
      const firstRequest = response.data[0];
      console.log(firstRequest);
      this.isOnlySellerId =
        response.data.length === 1 &&
        firstRequest.S_uid &&
        !firstRequest.Content &&
        !firstRequest.Deal_way &&
        !firstRequest.Location &&
        !firstRequest.Phone &&
        !firstRequest.Contact;

      // 현재 사용자와 판매자 ID 비교
      this.isSeller = this.userID === (firstRequest?.S_uid || "");
    } else {
      this.requestData = [];
      this.isOnlySellerId = false;
      this.isSeller = false;
    }
  } catch (error) {
    console.error("fetchRequestData: 요청 데이터 가져오기 오류 -", error);
    this.requestData = [];
    this.isOnlySellerId = false;
    this.isSeller = false;
  } finally {
    this.isLoading = false;
    console.log("isOnlySellerId:", this.isOnlySellerId);
    console.log("isSeller:", this.isSeller);
  }
},
    formatDate(dateString) {
      const options = { year: "numeric", month: "2-digit", day: "2-digit" };
      return new Date(dateString).toLocaleDateString("ko-KR", options);
    },
    async acceptRequest(requesterId) {
    try {
      const response = await axios.put(`http://localhost:3000/request/${this.ino}/${requesterId}`, {
        B_uid: requesterId,
      });

      if (response.data.success) {
        alert("요청이 성공적으로 수락되었습니다.");
        this.goBack(); // 이전 페이지로 이동
      } else {
        alert("요청 수락에 실패했습니다.");
      }
    } catch (error) {
      console.error("acceptRequest: 요청 수락 중 오류 -", error);
      alert("요청 수락 중 오류가 발생했습니다.");
    }
  },
    async deleteRequest(requesterId) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/request/${this.ino}/${requesterId}`
        );
        if (response.data.success) {
          alert("요청이 성공적으로 삭제되었습니다.");
          this.fetchRequestData(); // 삭제 후 데이터 갱신
        } else {
          alert("삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("deleteRequest: 요청 삭제 중 오류 -", error);
      }
    },
    async sendRequest() {
      try {
        const response = await axios.post(`http://localhost:3000/request/${this.ino}`, {
          R_uid: this.userID,
          Content: this.newRequest.content,
          Deal_way: this.newRequest.dealWay,
          Location: this.newRequest.location,
          Phone: this.newRequest.phone,
          Contact: this.newRequest.contact,
        });
        if (response.data.success) {
          alert("요청이 성공적으로 전송되었습니다.");
          this.newRequest = {
            content: "",
            dealWay: "0",
            location: "",
            phone: "",
            contact: "",
          };
          this.fetchRequestData(); // 요청 후 데이터 갱신
        } else {
          alert("요청 전송에 실패했습니다.");
        }
      } catch (error) {
        console.error("sendRequest: 요청 전송 중 오류 -", error);
      }
    },
    goBack() {
      this.$router.push(`/read/${this.ino}`);
    },
  },
  mounted() {
    this.fetchRequestData();
  },
};
</script>
<style scoped>

.request-page {
  max-width: 1100px;
  margin: 30px auto;
  padding: 30px;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.request-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.request-table th,
.request-table td {
  padding: 12px 15px;
  text-align: left; /* 모든 칸을 왼쪽 정렬 */
  border-bottom: 1px solid #e0e0e0;

  font-size: 14px; /* 글씨 크기를 줄임 */
}


.request-table th {
  background-color: #f4f4f4;
  font-weight: bold;
  color: #333;
  text-align: left; /* 헤더도 왼쪽 정렬 */
  font-size: 14px; /* 글씨 크기를 줄임 */
}
.request-table th:nth-child(1),
.request-table td:nth-child(1) {
  width: 10%; /* 내용 칸의 너비를 줄임 */
}
.request-table th:nth-child(2),
.request-table td:nth-child(2) {
  width: 20%; /* 내용 칸의 너비를 줄임 */
}

.request-table button {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* 삭제 버튼 스타일 */
.request-table .delete-button {
  background-color: #e74c3c !important; /* 빨간색 */
  color: white !important;
}

.request-table .delete-button:hover {
  background-color: #c0392b !important; /* 더 어두운 빨간색 */
}

/* 수락 버튼 스타일 */
.request-table .accept-button {
  background-color: #27ae60 !important; /* 초록색 */
  color: white !important;
}

.request-table .accept-button:hover {
  background-color: #1e8449 !important; /* 더 어두운 초록색 */
}

.request-form {
  background-color: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.request-form textarea {
  width: 100%;
  min-height: 120px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: vertical;
}

.form-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
}

.form-fields label {
  display: flex;
  flex-direction: column;
  font-weight: 500;
}

.form-fields input,
.form-fields select {
  margin-top: 5px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2980b9;
}

.back-button-container {
  margin-top: 20px;
  text-align: left; /* 왼쪽 정렬 */
}

.back-button-container button {
  background-color: #e0e0e0; /* 회색 배경색 */
  color: #333; /* 텍스트 색 */
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-button-container button:hover {
  background-color: #d0d0d0; /* 더 어두운 회색 */
}

</style>