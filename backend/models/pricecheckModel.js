const mysql = require("mysql");

// MySQL 연결 설정
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "MySQLpass",
    database: "db_market",
});

// Group3 데이터를 기반으로 연, 월 별 평균 시세 값 조회
exports.getPriceData = (group3, callback) => {
    const query = `
        SELECT 
            YEAR(Reg_date) AS year,
            MONTH(Reg_date) AS month,
            AVG(Price) AS avg_price
        FROM 
            item_datas
        WHERE 
            Group3 LIKE ?
        GROUP BY 
            YEAR(Reg_date), MONTH(Reg_date)
        ORDER BY 
            year, month;
    `;

    // 'iphone%'는 특정 문자열로 시작하는 데이터 검색
    connection.query(query, [`%${group3}%`], (err, results) => {
        if (err) {
            console.error("SQL Error:", err);
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};
