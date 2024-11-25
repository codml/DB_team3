var mysql = require('mysql');

var connection = mysql.createConnection({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'MySQLpass',
    database: 'db_market',
});

// 게시물 검색 함수
exports.readItem = (Ino, callback) => {
    let query = 'SELECT * FROM item_datas, usr WHERE Ino=? AND Uid = Id';
    let queryParams = [Ino];

    // 쿼리 실행
    connection.query(query, queryParams, (err, rows) => {
        if (err) {
            console.error("게시물 검색 중 오류 발생:", err);
            callback(err, null);
        } else {
            // console.log("검색 결과:", JSON.stringify(rows));
            callback(null, rows);
        }
    });
};

exports.deleteItem = (Ino, callback) => {
    let query = 'DELETE FROM item_datas WHERE Ino=?';
    let queryParams = [Ino];

    // 쿼리 실행
    connection.query(query, queryParams, (err, rows) => {
        if (err) {
            console.error("게시물 삭제 중 오류 발생:", err);
            callback(err);
        } else {
            callback(null);
        }
    });
};

exports.hitItem = (Ino, Uid, callback) => {
    let query = 'INSERT INTO user_like_items VALUES (?, ?)';
    let queryParams = [Ino, Uid];

    // 쿼리 실행
    connection.query(query, queryParams, (err, rows) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.warn("중복 입력 오류 발생:", err.message);
                callback({ duplicate: true }); // 중복 에러를 콜백으로 전달
            } else {
                console.error("쿼리 실행 중 오류 발생:", err);
                callback(err); // 다른 에러 전달
            }
        } else {
            callback(null); // 성공 시 데이터 전달
        }
    });
};

exports.reportItem = (Ino, req, callback) => {
    let query = 'INSERT INTO report VALUES (?, ?, ?, NOW())';
    let queryParams = [Ino, req.Uid, req.content];

    // 쿼리 실행
    connection.query(query, queryParams, (err, rows) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.warn("중복 입력 오류 발생:", err.message);
                callback({ duplicate: true }); // 중복 에러를 콜백으로 전달
            } else {
                console.error("쿼리 실행 중 오류 발생:", err);
                callback(err); // 다른 에러 전달
            }
        } else {
            callback(null); // 성공 시 데이터 전달
        }
    });
};
