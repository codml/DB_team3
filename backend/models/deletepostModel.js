const mysql = require("mysql");

// MySQL 연결 설정
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "MySQLpass",
    database: "db_market",
});

exports.deletePost = (uid, regDate) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM board WHERE Uid = ? AND Reg_date = ?`;

        console.log("Executing Query:", query);
        console.log("With Parameters:", [uid, regDate]);

        connection.query(query, [uid, regDate], (error, results) => {
            if (error) {
                console.error("DB Error in deletePost:", error);
                return reject(error);
            }

            console.log("Query Results:", results);
            resolve(results.affectedRows > 0); // 삭제 성공 여부 반환
        });
    });
};
