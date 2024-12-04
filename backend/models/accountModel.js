var mysql = require('mysql');

var connection = mysql.createConnection({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'MySQLpass',
    database: 'db_market',
});

// 아이디 찾기
exports.findID = (req) => {
    return new Promise((resolve, reject) => {

        const query = 'SELECT Id FROM usr WHERE Uname = ? AND Email = ?';
        connection.query(query, [req.userName, req.userEmail], (err, rows) => {
            if (err) {
                console.error('DB 오류:', err);
                reject('DB_ERROR');
                return;
            }

            if (rows.length === 0) {
                console.log('회원정보가 존재하지 않음');
                resolve(null); // 사용자 없음
                return;
            }

            const user = rows[0];
            console.log('아이디 찾기 성공:', user);
            resolve(user); // 사용자 데이터 반환
        });
    });
};

// 비밀번호 찾기
exports.findPW = (req) => {
    return new Promise((resolve, reject) => {

        const query = 'SELECT Uname, Passwd FROM usr WHERE Id = ? AND Email = ?';
        connection.query(query, [req.userID, req.userEmail], (err, rows) => {
            if (err) {
                console.error('DB 오류:', err);
                reject('DB_ERROR');
                return;
            }

            if (rows.length === 0) {
                console.log('회원정보가 존재하지 않음');
                resolve(null); // 사용자 없음
                return;
            }

            const user = rows[0];
            console.log('비밀번호 찾기 성공:', user);
            resolve(user); // 성공 시 사용자 데이터 반환
        });
    });
};