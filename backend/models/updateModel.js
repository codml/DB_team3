var mysql = require('mysql');

var connection = mysql.createConnection({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'MySQLpass',
    database: 'db_market',
});

exports.updateItem = (Ino, itemData, callback) => {
    let sql = `
        UPDATE item_datas
        SET Title = ?, Price = ?, Content = ?, Deal_way = ?, Place = ?, Group1 = ?, Group2 = ?, Group3 = ?`;
    let params = [itemData.Title, itemData.Price, itemData.Content, itemData.Deal_way, itemData.Place, itemData.Group1,
        itemData.Group2, itemData.Group3];

    if ((itemData.isImage) === 'false') {
        sql += `, Image = ?`;
        params.push(itemData.Image);
    }
    if ((itemData.isSubimg1) === 'false') {
        sql += `, Subimg1 = ?`;
        params.push(itemData.Subimg1);
    }
    if ((itemData.isSubimg2) === 'false') {
        sql += `, Subimg2 = ?`;
        params.push(itemData.Subimg2);
    }
    sql += ` WHERE Ino = ?`;
    params.push(Ino);
    connection.query(sql, params, (error, results) => {
        if (error) {
            console.error("Database Error: ", error);
            callback({ success: false, error });
        } else {
            callback({ success: true, data: results });
        }
    });
};