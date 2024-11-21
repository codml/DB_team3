var mysql = require('mysql');

var connection = mysql.createConnection({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'MySQLpass',
    database: 'db_market',
});

exports.fetchAllPosts = (callback) => {
    const noticeQuery = `
        SELECT Uid, Title, Content, Image, Notice,
        DATE_FORMAT(Reg_date, '%Y-%m-%d %H:%i:%s') AS Reg_date
        FROM board WHERE Notice = 1 ORDER BY Reg_date DESC;
    `;
    const generalPostQuery = `
        SELECT Uid, Title, Content, Image, Notice,
        DATE_FORMAT(Reg_date, '%Y-%m-%d %H:%i:%s') AS Reg_date
        FROM board WHERE Notice = 0 ORDER BY Reg_date DESC;
    `;

    // Execute both queries in parallel
    connection.query(noticeQuery, (noticeErr, noticeRows) => {
        if (noticeErr) {
            console.error('Notice SQL Error:', noticeErr);
            callback({ success: false, message: 'DB Fetch Error', error: noticeErr });
            return;
        }

        connection.query(generalPostQuery, (postErr, postRows) => {
            if (postErr) {
                console.error('Post SQL Error:', postErr);
                callback({ success: false, message: 'DB Fetch Error', error: postErr });
                return;
            }

            // Combine and return results
            const combinedRows = [...noticeRows, ...postRows];
            callback({ success: true, data: combinedRows });
        });
    });
};
