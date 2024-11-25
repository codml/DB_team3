// writepostController.js
var writepostModel = require('../models/writepostModel'); // 올바른 경로로 수정

exports.writePost = (req, res, next) => {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    // Uid 값 검증
    if (!req.body.Uid || req.body.Uid === "undefined") {
        return res.status(400).json({ success: false, message: "사용자 ID가 유효하지 않습니다." });
    }

    const postData = {
        ...req.body,
        Image: req.file ? req.file.buffer : null,
    };

    writepostModel.writePost(postData, (result) => {
        res.json(result);
    });
};

