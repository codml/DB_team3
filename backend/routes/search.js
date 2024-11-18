var express = require('express');
var router = express.Router();

var searchController = require('../controllers/searchController');

router.get('/', searchController.searchItems);

module.exports = router;