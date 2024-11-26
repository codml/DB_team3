var searchModel = require('../models/searchModel');

exports.searchItems = (req, res) => {
    console.log("req: " + JSON.stringify(req.query));
    
    // searchModel 호출
    searchModel.searchItems(req.query, (err, rows) => {
        if (err) {
            console.error("query error");
            res.status(500).json({ error: "Query execution failed." });
        } else {
            // 이미지 데이터를 Base64로 변환
            const modifiedRows = rows.map(row => ({
                ...row,
                Image: row.Image
                    ? Buffer.from(row.Image).toString("base64") // Base64 인코딩
                    : null
            }));

            // console.log("검색 결과:", JSON.stringify(modifiedRows));
            res.json(modifiedRows); // 수정된 데이터 전송
        }
    });
};