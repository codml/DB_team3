const MySQL = require('./Model');

exports.writePost = (postData, callback) => {
    const query = `
      INSERT INTO board (Uid, Title, Content, Image, Notice, Reg_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    MySQL.query(
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
