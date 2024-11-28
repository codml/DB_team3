var mysql = require('mysql');

var connection = mysql.createConnection({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'MySQLpass',
    database: 'db_market',
});

exports.userLocation = (req, callback) => {
    console.log(req);

    connection.query('SELECT * FROM usr WHERE Address = ?;', [req.user], function(err, rows) {
        if (err) {
            console.error("DB 오류:", err);
            callback('fail');
            return;
        }

        if (rows.length === 0) {
            console.log("사용자의 주소가 존재하지 않음");
            callback('Address fail');
            return;
        }

        const location = rows[0];
        console.log("위치 가져오기 성공");
        callback('success', location); // 성공 시 사용자 데이터 반환
    });
};

