var express = require('express');
var router = express.Router();
const multer = require('multer');

// Multer configuration for memory storage
const upload = multer({ storage: multer.memoryStorage() });

var signupController = require('../controllers/signupController');
var loginController = require('../controllers/loginController');
var mypageController = require('../controllers/mypageController');
var searchController = require('../controllers/searchController');
var readController = require('../controllers/readController');
var updateController = require('../controllers/updateController');
var writeController = require('../controllers/writeController');
var boardpageController = require('../controllers/boardpageController');
var writepostController = require('../controllers/writepostController');
var viewpostController = require("../controllers/viewpostController");
var updatepostController = require("../controllers/updatepostController");
var deletepostController = require("../controllers/deletepostController");
var pricecheckController = require("../controllers/pricecheckController");

router.post('/signup', signupController.insertUser);
router.post('/login', loginController.loginUser);
router.get('/mypage', mypageController.getUserInformation);
router.post('/write', writeController.insertItems);
router.get('/search', searchController.searchItems);
router.get('/read/:Ino', readController.readItem);
router.get('/delete/:Ino', readController.deleteItem);
router.put('/update/:Ino', updateController.updateItem);
router.post('/hit/:Ino', readController.hitItem);
router.post('/report/:Ino', readController.reportItem);
router.get('/boardpage', boardpageController.getBoardPosts);
router.post('/writepost', upload.single('Image'), writepostController.writePost);
router.get("/viewpost/", viewpostController.getPost);
router.put('/updatepost', upload.single('Image'), updatepostController.updatePost);
router.delete('/deletepost', deletepostController.deletePost);
router.get('/price', pricecheckController.priceCheck);

module.exports = router;
