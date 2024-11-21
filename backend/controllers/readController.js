var readModel = require('../models/readModel');

exports.readItem = (req, res) => {
    var Ino = req.params.Ino;
    console.log(Ino);

    // readModel 호출
    readModel.readItem(Ino, (err, rows) => {
        
        if (err) {
            console.error("query error");
            res.status(500).json({ error: "Query execution failed." });
        } else {
            // 이미지 데이터를 Base64로 변환
            // 이미지 데이터를 Base64로 변환
        const modifiedRows = rows.map(row => ({
            ...row,
            Image: row.Image ? Buffer.from(row.Image).toString("base64") : null, // Base64 인코딩
            Subimg1: row.Subimg1 ? Buffer.from(row.Subimg1).toString("base64") : null, // Base64 인코딩
            Subimg2: row.Subimg2 ? Buffer.from(row.Subimg2).toString("base64") : null  // Base64 인코딩
        }));
        console.log("검색 결과:", JSON.stringify(modifiedRows[0].Title));
        res.json(modifiedRows); // 수정된 데이터 전송
        }
    });
};