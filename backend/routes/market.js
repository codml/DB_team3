var express = require('express');
var router = express.Router();
const multer = require('multer');

// Multer configuration for memory storage
const upload = multer({ storage: multer.memoryStorage() });

var signupController = require('../controllers/signupController');
var loginController = require('../controllers/loginController');
var searchController = require('../controllers/searchController');
var boardpageController = require('../controllers/boardpageController');
var writepostController = require('../controllers/writepostController');

router.post('/signup', signupController.insertUser);
router.post('/login', loginController.loginUser);
router.get('/search', searchController.searchItems);
router.get('/boardpage', boardpageController.getBoardPosts);
// Route for posting to writepost
router.post('/wriepost', upload.single('Image'), writepostController.writePost);

module.exports = router;
