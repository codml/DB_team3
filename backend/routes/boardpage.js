var express = require('express');
var router = express.Router();
var boardpageController = require('../controllers/boardpageController');

// GET /boardpage
router.get('/', boardpageController.getBoardPosts);

module.exports = router;
