var express = require('express');
var router = express.Router();

var signupController = require('../controllers/signupController');
var loginController = require('../controllers/loginController');

router.post('/signup', signupController.insertUser);
router.post('/login', loginController.loginUser);

module.exports = router;
