const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "MySQLpass",
    database: "db_market",
});
exports.updatePost = (postData, callback) => {
    const { Uid, Reg_date, Title, Content, Image, New_Reg_date } = postData;

    let query = `
      UPDATE board
      SET Title = ?, Content = ?, Reg_date = ?
    `;
    const queryParams = [Title, Content, New_Reg_date];

    // 이미지 처리 로직 명확화
    if (Image === null || Image === "delete") {
        query += `, Image = NULL`; // 명시적으로 NULL 처리
    } else if (Image) {
        query += `, Image = ?`;
        queryParams.push(Image);
    }

    query += `
      WHERE Uid = ? AND Reg_date = ?;
    `;
    queryParams.push(Uid, Reg_date);

    connection.query(query, queryParams, (err, result) => {
        if (err) {
            console.error("SQL Execution Error:", err);
            callback(err, null);
        } else {
            callback(null, result);
        }
    });
};
