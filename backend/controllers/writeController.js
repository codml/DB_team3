const multer = require('multer');
const writeModel = require('../models/writeModel');

// Multer 설정 (메모리 저장소 사용)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
}).fields([
    { name: 'Image', maxCount: 1 },
    { name: 'Subimg1', maxCount: 1 },
    { name: 'Subimg2', maxCount: 1 },
]);

// 컨트롤러 함수
exports.insertItems = (req, res, next) => {
    upload(req, res, function (err) {
        if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        console.log(req.body);
        // 요청 데이터 및 파일 추출
        const { Uid, Title, Price, Content, Deal_way, Place, Group1, Group2, Group3 } = req.body;

        const itemData = {
            Uid,
            Title,
            Image: req.files?.Image?.[0]?.buffer || null, // 바이너리 데이터
            Subimg1: req.files?.Subimg1?.[0]?.buffer || null,
            Subimg2: req.files?.Subimg2?.[0]?.buffer || null,
            Price: parseInt(Price, 10),
            Content,
            Deal_way: parseInt(Deal_way, 10),
            Place: Place || null,
            Group1,
            Group2,
            Group3,
        };

        writeModel.insertItems(itemData, (result) => {
            if (result.success) {
                res.status(200).json({ message: "Item successfully inserted.", data: result.data });
            } else {
                res.status(500).json({ message: "Failed to insert item.", error: result.error });
            }
        });
    });
};
