var mysql = require('mysql');

var connection = mysql.createConnection({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'MySQLpass',
    database: 'db_market',
});

exports.fetchAllPosts = (callback) => {
    const query = `
        SELECT Uid, Title, Content, Image, Notice,
        DATE_FORMAT(Reg_date, '%Y-%m-%d %H:%i:%s') AS Reg_date
        FROM board ORDER BY Notice DESC, Reg_date DESC;
    `;

    connection.query(query, (err, rows) => {
        if (err) {
            console.error('SQL Error:', err);
            callback({ success: false, message: 'DB Fetch Error', error: err });
            return;
        }

        // Convert image buffers to base64 strings
        const processedRows = rows.map(row => {
            return row;
        });

        console.log("Fetched Data:", processedRows); // 데이터 확인
        callback({ success: true, data: processedRows });
    });
};