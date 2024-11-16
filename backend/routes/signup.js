var express = require('express');
var router = express.Router();

var signupController = require('../controllers/signupController');

router.post('/', signupController.insertUser);

module.exports = router;
