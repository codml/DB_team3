const mysql = require('mysql');

// MySQL 연결 설정
const connection = mysql.createConnection({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'MySQLpass',
    database: 'db_market'
});


exports.getUser = (userID, callback) => {
	console.log("userId: " + userID);

    connection.query('SELECT * FROM usr WHERE Id = ?;', [userID], function(err, rows) {
        if (err) {
            console.error("DB 오류");
            callback('fail');
            return;
        }

        if (rows.length === 0) {
            console.log("아이디가 존재하지 않음");
            callback('ID not exist');
            return;
        }

		const user = rows[0];
		callback('success', user); // 성공 시 사용자 데이터 반환
    });
};

