const MySQL = require('./Model');

exports.fetchAllPosts = (callback) => {
    const query = `SELECT * FROM board ORDER BY Notice DESC, Reg_date DESC;`;
    
    MySQL.query(query, (err, rows) => {
        if (err) {
            console.error('SQL Error:', err);
            callback({ success: false, message: 'DB Fetch Error', error: err });
            return;
        }
        callback({ success: true, data: rows });
    });
};
