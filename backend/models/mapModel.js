var mysql = require('mysql');

var connection = mysql.createConnection({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'MySQLpass',
    database: 'db_market',
});

exports.getItemLocations = (req, callback) => {
    let query = `SELECT Ino, Title, Place FROM item_datas`;

    connection.query(query, (err, rows) => {
        if (err) {
            console.error("게시물 검색 중 오류 발생:", err);
            callback(err, null);
        } else {
            console.log("검색 결과:", JSON.stringify(rows));
            callback(null, rows);
        }
    });
};