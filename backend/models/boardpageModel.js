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
    SELECT * FROM board ORDER BY Notice DESC, Reg_date DESC;
  `;
    connection.query(query, (err, rows) => {
        if (err) {
            console.error('SQL Error:', err);
            callback({ success: false, message: 'DB Fetch Error', error: err });
            return;
        }
        callback({ success: true, data: rows });
    });
};
