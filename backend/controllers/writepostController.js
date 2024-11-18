// writepostController.js
var writepostModel = require('../models/writepostModel'); // 올바른 경로로 수정

exports.writePost = (req, res, next) => {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const postData = {
        ...req.body,
        Uid: req.body.Uid || 'userTest', // 기본값 설정
        Image: req.file ? req.file.buffer : null, // 단일 이미지의 바이너리 데이터
    };

    writepostModel.writePost(postData, (result) => {
        res.json(result);
    });
};
