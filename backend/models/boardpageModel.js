var mysql = require('mysql');

var connection = mysql.createConnection({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: '0703Sql!!',
    database: 'db_market',
});

exports.fetchAllPosts = (callback) => {
    const query = `
SELECT Uid, Title, Content, Image, Notice,
DATE_FORMAT(CONVERT_TZ(Reg_date, '+00:00', '+09:00'), '%Y-%m-%d %H:%i:%s') AS Reg_date
FROM board ORDER BY Notice DESC, Reg_date DESC;
`;

    connection.query(query, (err, rows) => {
        if (err) {
            console.error('SQL Error:', err);
            callback({ success: false, message: 'DB Fetch Error', error: err });
            return;
        }
        console.log("Fetched Data:", rows); // 데이터 확인
        callback({ success: true, data: rows });
    });
};
