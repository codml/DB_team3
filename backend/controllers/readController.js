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

exports.deleteItem = (req, res) => {
    var Ino = req.params.Ino;
    console.log(Ino);

    // readModel 호출
    readModel.deleteItem(Ino, (err) => {
        if (err) {
            console.error("query error");
            res.status(500).json({ error: "Query execution failed." });
        } else
            res.json({success: true});
    });
};

exports.hitItem = (req, res) => {
    var Ino = req.params.Ino;
    console.log(Ino);

    // readModel 호출
    readModel.hitItem(Ino, req.body.Uid, (err) => {
        if (err) {
            if (err.duplicate) {
                // 중복 에러인 경우 200 상태 코드와 실패 메시지 전송
                return res.json({ success: false, message: "Duplicate entry." });
            }
            console.error("query error");
            res.status(500).json({ error: "Query execution failed." });
        }
        else
            res.json({success: true});
    });
};

exports.reportItem = (req, res) => {
    var Ino = req.params.Ino;
    console.log(Ino);

    // readModel 호출
    readModel.reportItem(Ino, req.body, (err) => {
        if (err) {
            if (err.duplicate) {
                // 중복 에러인 경우 200 상태 코드와 실패 메시지 전송
                return res.json({ success: false, message: "Duplicate entry." });
            }
            console.error("query error");
            res.status(500).json({ error: "Query execution failed." });
        }
        else
            res.json({success: true});
    });
};

exports.reviewItem = (req, res) => {
    var Ino = req.params.Ino;
    console.log(Ino);

    // readModel 호출
    readModel.reviewItem(Ino, req.body, (err) => {
        if (err) {
            console.error("query error");
            res.status(500).json({ error: "Query execution failed." });
        }
        else
            res.json({success: true});
    });
};

exports.readQnA = (req, res) => {
    var Ino = req.params.Ino;
    console.log(Ino);

    // readModel 호출
    readModel.readQnA(Ino, (err, rows) => {
        if (err) {
            console.error("query error");
            res.status(500).json({ error: "Query execution failed." });
        }
        else {
            console.log("검색 결과:", JSON.stringify(rows));
            res.json(rows); // 수정된 데이터 전송
        }
    });
};

exports.writeQnA = (req, res) => {
    var Ino = req.params.Ino;
    console.log(Ino);

    // readModel 호출
    readModel.writeQnA(Ino, req.body, (err) => {
        if (err) {
            console.error("query error");
            res.status(500).json({ error: "Query execution failed." });
        }
        else
            res.json({success: true});
    });
};

exports.deleteQnA = (req, res) => {
    var Qno = req.params.Qno;
    console.log(Qno);

    // readModel 호출
    readModel.deleteQnA(Qno, (err) => {
        if (err) {
            console.error("query error");
            res.status(500).json({ error: "Query execution failed." });
        }
        else {
            res.json({success: true}); // 결과 전송
        }
    });
};