var mysql = require('mysql');

var connection = mysql.createConnection({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'MySQLpass',
    database: 'db_market',
});

exports.getPost = (uid, regDate) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT *,
        DATE_FORMAT(Reg_date, '%Y-%m-%d %H:%i:%s') AS Reg_date
        FROM board 
        WHERE Uid = ? AND Reg_date = ?`;
        console.log("Executing Query:", query); // 디버깅
        console.log("With Parameters:", [uid, regDate]); // 디버깅
        connection.query(query, [uid, regDate], (error, results) => {
            if (error) {
                console.error("DB Error:", error);
                return reject(error);
            }
            console.log("Query Results:", results); // 디버깅
            resolve(results[0]); // 첫 번째 결과 반환
        });
    });
};


