var express = require('express');
var router = express.Router();
const multer = require('multer');

// Multer configuration for memory storage
const upload = multer({ storage: multer.memoryStorage() });

//  회원가입, 로그인 컨트롤러
var signupController = require('../controllers/signupController');
var loginController = require('../controllers/loginController');

//  마이페이지 컨트롤러
var mypageController = require('../controllers/mypageController');

//  메인 페이지 지도 API 회원 주변의 상품 검색 컨트롤러
var mapController = require('../controllers/mapController');

//  상품 검색 페이지 + 상품 상세 정보 페이지 컨트롤러
var readController = require('../controllers/readController');
var requestController = require("../controllers/requestController");

//  상품 등록 컨트롤러
var writeController = require('../controllers/writeController');
var searchController = require('../controllers/searchController');
var updateController = require('../controllers/updateController');

//  시세 조회 컨트롤러
var pricecheckController = require("../controllers/pricecheckController");

//  자유 게시판 컨트롤러
var boardpageController = require('../controllers/boardpageController');
var writepostController = require('../controllers/writepostController');
var viewpostController = require("../controllers/viewpostController");
var updatepostController = require("../controllers/updatepostController");
var deletepostController = require("../controllers/deletepostController");

/* ============================================================================================= */

//  로그인, 회원가입
router.post('/signup', signupController.insertUser);
router.post('/login', loginController.loginUser);

//  마이페이지
router.get('/mypage', mypageController.getUserInformation);
router.post('/mypage', upload.single("Profile_image"), mypageController.modifyUserInformation);
router.get('/mypage/sale', mypageController.getSaleItems);
router.get('/mypage/purchase', mypageController.getPurchaseItems);

//  지도 API - 회원 주변의 상품 검색
router.post('/map', mapController.getUserLocation);
router.get('/map', mapController.getItemLocations);
router.post('/map/search', mapController.searchLocation);

//  상품 등록 및 수정
router.post('/write', writeController.insertItems);
router.put('/update/:Ino', updateController.updateItem);

//  상품 검색 및 삭제
router.get('/search', searchController.searchItems);
router.get('/read/:Ino', readController.readItem);
router.get('/delete/:Ino', readController.deleteItem);

// 상품 상세 기능 - 좋아요, 신고, 질문/답변
router.post('/hit/:Ino', readController.hitItem);
router.post('/report/:Ino', readController.reportItem);
router.get('/readQnA/:Ino', readController.readQnA);
router.post('/writeQnA/:Ino', readController.writeQnA);
router.delete('/deleteQnA/:Qno', readController.deleteQnA);

//  상품 상세 기능 - 구매 요청 및 후기
router.get('/request/:Ino', requestController.getrequest);
router.delete('/request/:Ino/:R_uid', requestController.deleterequest);
router.post('/request/:Ino', requestController.sendrequest);
router.put('/request/:Ino/:B_uid', requestController.acceptrequest);
router.post('/review/:Ino', readController.reviewItem);

//  시세 조회
router.get('/price', pricecheckController.priceCheck);
router.get('/boardpage', boardpageController.getBoardPosts);
router.post('/writepost', upload.single('Image'), writepostController.writePost);
router.get("/viewpost/", viewpostController.getPost);
router.put('/updatepost', upload.single('Image'), updatepostController.updatePost);
router.delete('/deletepost', deletepostController.deletePost);

module.exports = router;
