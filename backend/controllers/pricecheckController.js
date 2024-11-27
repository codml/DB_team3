var pricecheckModel = require('../models/pricecheckModel');

// 가격 데이터를 가져오는 컨트롤러
exports.priceCheck = (req, res) => {
    const group3 = req.query.group3; // 검색창에서 입력받은 Group3 값

    if (!group3) {
        return res.status(400).json({ error: "Group3 value is required" });
    }

    pricecheckModel.getPriceData(group3, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Failed to fetch price data" });
        }
        res.json(results);
    });
};
