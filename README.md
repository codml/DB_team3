# DB_team3

#### 웹 실행법!!!

frontend 경로에서 
##### yarn serve

backend 경로에서 
##### npm start

둘 다 켜놔야됨

---

#### 추가 라이브러리

npm install jsonwebtoken bcryptjs body-parse

npm install jwt-decode

---

##### git push 시 주의점!!!
yarn.lock 때문에 에러가 발생하니 frontend 파일에서 node_modules 빼고 push 해주세요

git pull 에러나면 yarn.lock 삭제후 git pull하기

git pull 후에 yarn install 하면 정상적으로 실행됩니다

---

#### 작업 기록

11.13 - 로그인, 회원가입, 상품 등록 페이지 UI 디자인 완료

11.18 - 지금까지 모든 작업 main에 병합 완료

11.29 - 지도 API 기능. 

사용법 : 지역(ex. 광운대학교, 광운대역, 석계역 등...)을 검색하면 해당 지역으로 이동해서 그 주변의 상품을 보여줌.

** 주의 ** : 상품의 판매 위치가 도로명 또는 행정명 주소여야 위치를 정확하게 표시됨.
