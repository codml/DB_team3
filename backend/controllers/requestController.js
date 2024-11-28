var requestModel = require('../models/requestModel');

exports.getrequest = (req, res) => {
    const ino = req.params.Ino;
    const userId = req.query.userId;

    console.debug("getrequest: 요청된 Ino -", ino, "요청된 사용자 ID -", userId);

    requestModel.getRequestData(ino, userId, (err, results) => {
        if (err) {
            console.error("getrequest: 데이터베이스 오류 -", err);
            res.status(500).send("요청 데이터를 가져오는 중 오류 발생");
        } else if (!results || results.length === 0) {
            console.warn("getrequest: 해당하는 데이터 없음");
            res.status(404).send("해당 데이터가 존재하지 않습니다.");
        } else {
            console.debug("getrequest: 데이터 수신 성공 -", results);
            res.json(results); // 전체 결과를 반환합니다.
        }
    });
};

// 구매 요청 삭제
exports.deleterequest = (req, res) => {
    const ino = req.params.Ino;
    const r_uid = req.params.R_uid;

    console.debug("deleterequest: 요청된 Ino -", ino, "삭제할 R_uid -", r_uid);

    requestModel.deleteRequest(ino, r_uid, (err, result) => {
        if (err) {
            console.error("deleterequest: 데이터베이스 오류 -", err);
            res.status(500).send({ success: false, message: "요청 삭제 중 오류 발생" });
        } else if (result.affectedRows === 0) {
            console.warn("deleterequest: 삭제할 데이터 없음");
            res.status(404).send({ success: false, message: "삭제할 데이터가 존재하지 않습니다." });
        } else {
            console.debug("deleterequest: 요청 삭제 성공 -", result);
            res.send({ success: true, message: "요청이 성공적으로 삭제되었습니다." });
        }
    });
};

// 구매 요청 생성
exports.sendrequest = (req, res) => {
    const ino = req.params.Ino;
    const { R_uid, Content, Deal_way, Location, Phone, Contact } = req.body;

    console.debug("sendrequest: 요청된 Ino -", ino, "요청자 R_uid -", R_uid);

    requestModel.sendRequest(
        ino, R_uid, Content, Deal_way, Location, Phone, Contact,
        (err, result) => {
            if (err) {
                console.error("sendrequest: 데이터베이스 오류 -", err);
                res.status(500).send({ success: false, message: "요청 생성 중 오류 발생" });
            } else {
                console.debug("sendrequest: 요청 생성 성공 -", result);
                res.send({ success: true, message: "요청이 성공적으로 생성되었습니다." });
            }
        }
    );
};

// 거래 수락 기능 추가
exports.acceptrequest = (req, res) => {
    const ino = req.params.Ino;
    const { B_uid } = req.body;

    console.debug("acceptRequest: 요청된 Ino -", ino, "수락된 B_uid -", B_uid);

    requestModel.acceptRequest(ino, B_uid, (err, result) => {
        if (err) {
            console.error("acceptRequest: 데이터베이스 오류 -", err);
            res.status(500).send({ success: false, message: "구매자 업데이트 중 오류 발생" });
        } else if (result.affectedRows === 0) {
            console.warn("acceptRequest: 업데이트할 데이터 없음");
            res.status(404).send({ success: false, message: "업데이트할 데이터가 존재하지 않습니다." });
        } else {
            console.debug("acceptRequest: 구매자 업데이트 성공 -", result);
            res.send({ success: true, message: "구매자가 성공적으로 업데이트되었습니다." });
        }
    });
};
