var mysql = require('mysql');

var connection = mysql.createConnection({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'MySQLpass',
    database: 'db_market',
});

// 게시물 검색 함수
exports.readItem = (Ino, callback) => {
    let query =`SELECT I.*, U.*,
                    R.Ratings,
                    R.Content AS ReviewContent,
                    R.Reg_date AS ReviewReg_date
                FROM 
                    item_datas I
                JOIN 
                    usr U 
                    ON I.Uid = U.Id
                LEFT JOIN 
                    review R 
                    ON I.Ino = R.Ino
                WHERE 
                    I.Ino = ?`;
    let queryParams = [Ino];

    // 쿼리 실행
    connection.query(query, queryParams, (err, rows) => {
        if (err) {
            console.error("게시물 검색 중 오류 발생:", err);
            callback(err, null);
        } else {
            // console.log("검색 결과:", JSON.stringify(rows));
            callback(null, rows);
        }
    });
};

exports.deleteItem = (Ino, callback) => {
    let query = 'DELETE FROM item_datas WHERE Ino=?';
    let queryParams = [Ino];

    // 쿼리 실행
    connection.query(query, queryParams, (err, rows) => {
        if (err) {
            console.error("게시물 삭제 중 오류 발생:", err);
            callback(err);
        } else {
            callback(null);
        }
    });
};

exports.hitItem = (Ino, Uid, callback) => {
    let query = 'INSERT INTO user_like_items VALUES (?, ?)';
    let queryParams = [Ino, Uid];

    // 쿼리 실행
    connection.query(query, queryParams, (err, rows) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.warn("중복 입력 오류 발생:", err.message);
                callback({ duplicate: true }); // 중복 에러를 콜백으로 전달
            } else {
                console.error("쿼리 실행 중 오류 발생:", err);
                callback(err); // 다른 에러 전달
            }
        } else {
            callback(null); // 성공 시 데이터 전달
        }
    });
};

exports.reportItem = (Ino, req, callback) => {
    let query = 'INSERT INTO report VALUES (?, ?, ?, NOW())';
    let queryParams = [Ino, req.Uid, req.content];

    // 쿼리 실행
    connection.query(query, queryParams, (err, rows) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.warn("중복 입력 오류 발생:", err.message);
                callback({ duplicate: true }); // 중복 에러를 콜백으로 전달
            } else {
                console.error("쿼리 실행 중 오류 발생:", err);
                callback(err); // 다른 에러 전달
            }
        } else {
            callback(null); // 성공 시 데이터 전달
        }
    });
};

exports.reviewItem = (Ino, req, callback) => {
    let query = 'INSERT INTO review VALUES (?, ?, ?, ?, ?, NOW())';
    let queryParams = [Ino, req.S_uid, req.B_uid, req.Content, req.Ratings];

    // 쿼리 실행
    connection.query(query, queryParams, (err, rows) => {
        if (err) {
            console.error("쿼리 실행 중 오류 발생:", err);
            callback(err); // 에러 전달
        } else {
            callback(null); // 성공 시 데이터 전달
        }
    });
};

exports.readQnA = (Ino, callback) => {
    let query = `SELECT
                    Q.Qno AS QuesNo,
                    A.Qno AS AnsNo,
                    Q.Q_uid AS Uid,
                    U.Uname AS Username,
                    Q.Content AS Question,
                    A.Content AS Answer,
                    Q.Private AS Q_private,
                    A.Private AS A_private,
                    Q.Reg_date AS Q_date,
                    A.Reg_date AS A_date
                FROM question AS Q LEFT JOIN question AS A ON (A.Ans_Qno = Q.Qno)
                        JOIN usr as U ON (Q.Q_uid = U.Id)
                WHERE Q.Ino = ? AND Q.Ans_Qno IS NULL`;
    let queryParams = [Ino];

    // 쿼리 실행
    connection.query(query, queryParams, (err, rows) => {
        if (err) {
            console.error("게시물 검색 중 오류 발생:", err);
            callback(err, null);
        } else {
            // console.log("검색 결과:", JSON.stringify(rows));
            callback(null, rows);
        }
    });
};

exports.writeQnA = (Ino, req, callback) => {
    let query = `INSERT INTO question(Ino, Q_uid, Content, Private, Reg_date, Ans_Qno)
                VALUES (?, ?, ?, ?, NOW(), ?)`;
    let queryParams = [Ino, req.Q_uid, req.Content, req.Private, req.Ans_Qno];

    // 쿼리 실행
    connection.query(query, queryParams, (err, rows) => {
        if (err) {
            console.error("쿼리 실행 중 오류 발생:", err);
            callback(err); // 에러 전달
        } else {
            callback(null); // 성공 시 데이터 전달
        }
    });
};

exports.deleteQnA = (Qno, callback) => {
    let query = 'DELETE FROM question WHERE Qno=? OR Ans_Qno=?';
    let queryParams = [Qno, Qno];

    // 쿼리 실행
    connection.query(query, queryParams, (err) => {
        if (err) {
            console.error("게시물 삭제 중 오류 발생:", err);
            callback(err);
        } else {
            callback(null);
        }
    });
};