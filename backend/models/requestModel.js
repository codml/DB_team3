var mysql = require('mysql');

var connection = mysql.createConnection({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'MySQLpass',
    database: 'db_market',
});
exports.getRequestData = (ino, userId, callback) => {
    const query = `
        SELECT 
    r.Ino, 
    r.R_uid, 
    r.Content, 
    r.Deal_way, 
    r.Location, 
    r.Phone, 
    r.Contact, 
    r.Reg_date,
    i.uid AS S_uid
FROM 
    request r
RIGHT OUTER JOIN 
    item_datas i 
ON 
    r.Ino = i.Ino AND (r.R_uid = ? OR i.uid = ?)
WHERE 
    i.Ino = ?;
    `;

    console.debug("getRequestData: 쿼리 실행 -", query, "파라미터 -", [ino, userId, userId]);

    connection.query(query, [userId, userId, ino], (err, results) => {
        if (err) {
            console.error("getRequestData: 쿼리 오류 -", err);
            return callback(err, null);
        }
        console.debug("getRequestData: 쿼리 결과 -", results);
        return callback(null, results); // 전체 결과 반환
    });
};

// 구매 요청 삭제
exports.deleteRequest = (ino, r_uid, callback) => {
    const query = `
        DELETE FROM request 
        WHERE Ino = ? AND R_uid = ?
    `;
    console.debug("deleteRequest: 쿼리 실행 -", query, "파라미터 -", [ino, r_uid]);

    connection.query(query, [ino, r_uid], (err, result) => {
        if (err) {
            console.error("deleteRequest: 쿼리 오류 -", err);
            return callback(err);
        }
        console.debug("deleteRequest: 삭제 결과 -", result);
        callback(null, result);
    });
};

// 구매 요청 생성
exports.sendRequest = (ino, r_uid, content, dealWay, location, phone, contact, callback) => {
    const query = `
        INSERT INTO request (Ino, R_uid, Content, Deal_way, Location, Phone, Contact, Reg_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const params = [ino, r_uid, content, dealWay, location, phone, contact];
    console.debug("sendRequest: 쿼리 실행 -", query, "파라미터 -", params);

    connection.query(query, params, (err, result) => {
        if (err) {
            console.error("sendRequest: 쿼리 오류 -", err);
            return callback(err);
        }
        console.debug("sendRequest: 요청 생성 결과 -", result);
        callback(null, result);
    });
};

exports.acceptRequest = (ino, b_uid, callback) => {
    const query = `
      UPDATE item_datas 
      SET B_uid = ? 
      WHERE Ino = ?
    `;
    console.debug("updateBuyer: 쿼리 실행 -", query, "파라미터 -", [b_uid, ino]);

    connection.query(query, [b_uid, ino], (err, result) => {
        if (err) {
            console.error("updateBuyer: 쿼리 오류 -", err);
            return callback(err);
        }
        console.debug("updateBuyer: 업데이트 결과 -", result);
        callback(null, result);
    });
};