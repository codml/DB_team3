var express = require('express');
var router = express.Router();
var writepostController = require('../controllers/writepostController');
const multer = require('multer');

// Multer configuration for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Route for posting to writepost
router.post('/', upload.single('Image'), writepostController.writePost);

module.exports = router;
