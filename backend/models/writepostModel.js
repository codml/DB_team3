var mysql = require('mysql');

var connection = mysql.createConnection({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'MySQLpass',
    database: 'db_market',
});

exports.writePost = (postData, callback) => {
    const query = `
      INSERT INTO board (Uid, Title, Content, Image, Notice, Reg_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query(
        query,
        [
            postData.Uid,
            postData.Title,
            postData.Content,
            postData.Image, // Binary image data
            postData.Notice,
            postData.Reg_Date,
        ],
        function (err, rows) {
            if (err) {
                console.error('SQL Error:', err);
                callback({ success: false, message: 'DB Insert Error', error: err });
                return;
            }
            console.log('SQL Rows:', rows);
            callback({ success: true, data: rows });
        }
    );
};
