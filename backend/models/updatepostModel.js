const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "MySQLpass",
    database: "db_market",
});

exports.updatePost = (postData) => {
    return new Promise((resolve, reject) => {
        const { Uid, Reg_date, Title, Content, Image, New_Reg_date } = postData;

        // Update query to modify the board post
        const sql = `
      UPDATE board
      SET Title = ?, Content = ?, Image = ?, Reg_date = ?
      WHERE Uid = ? AND Reg_date = ?
    `;

        // Execute the query
        connection.query(
            sql,
            [Title, Content, Image, New_Reg_date, Uid, Reg_date],
            (error, results) => {
                if (error) {
                    console.error("Error executing update query:", error);
                    reject(error);
                } else {
                    resolve(results);
                }
            }
        );
    });
};
