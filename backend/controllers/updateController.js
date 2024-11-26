const multer = require('multer');
const updateModel = require('../models/updateModel');

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
exports.updateItem = (req, res, next) => {
    upload(req, res, function (err) {
			if (err) {
					return res.status(400).json({ success: false, message: err.message });
			}
			var Ino = req.params.Ino;
			// 요청 데이터 및 파일 추출
			const itemData = {
			    Title: req.body.Title,
					isImage: req.body.isImage,
					isSubimg1: req.body.isSubimg1,
					isSubimg2: req.body.isSubimg2,
			    Image: req.files?.Image?.[0]?.buffer || null, // 바이너리 데이터
			    Subimg1: req.files?.Subimg1?.[0]?.buffer || null,
			    Subimg2: req.files?.Subimg2?.[0]?.buffer || null,
			    Price: parseInt(req.body.Price, 10),
			    Content: req.body.Content,
			    Deal_way: parseInt(req.body.Deal_way, 10),
			    Place: req.body.Place || null,
			    Group1: req.body.Group1,
			    Group2: req.body.Group2,
			    Group3: req.body.Group3,
			};

			updateModel.updateItem(Ino, itemData, (result) => {
			    if (result.success) {
			        res.status(200).json({ message: "Item successfully updated.", data: result.data });
			    } else {
			        res.status(500).json({ message: "Failed to update item.", error: result.error });
			    }
			});
	});
};