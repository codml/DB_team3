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
    let query = 'SELECT * FROM item_datas WHERE Ino=?';
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
