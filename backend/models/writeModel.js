var mysql = require('mysql');

var connection = mysql.createConnection({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'MySQLpass',
    database: 'db_market',
});

exports.insertItems = (itemData, callback) => {
    const {
        Uid,
        Title,
        Image,
        Subimg1,
        Subimg2,
        Price,
        Content,
        Deal_way,
        Place,
        Group1,
        Group2,
        Group3,
    } = itemData;

    const sql = `
        INSERT INTO item_datas (
            Uid, Title, Image, Subimg1, Subimg2, Price, Content, Deal_way, Place, Group1, Group2, Group3, Reg_date
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()
        )
    `;

    const values = [
        Uid,
        Title,
        Image,
        Subimg1,
        Subimg2,
        Price,
        Content,
        Deal_way,
        Place,
        Group1,
        Group2,
        Group3,
    ];

    connection.query(sql, values, (error, results) => {
        if (error) {
            console.error("Database Error: ", error);
            callback({ success: false, error });
        } else {
            callback({ success: true, data: results });
        }
    });
};
