var mysql = require('mysql');

var connection = mysql.createConnection({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'MySQLpass',
    database: 'db_market',
});

// 게시물 검색 함수
exports.searchItems = (req, callback) => {
    // 기본 쿼리 시작
    let query = `SELECT Ino, Image, Title, Price, Like_cnt, Place, Reg_date, Group1, Group2 FROM item_datas WHERE 1=1`;
    let queryParams = [];

    // mainCategory가 존재하는 경우 조건 추가
    if (req.mainCategory && req.mainCategory !== "") {
        query += ` AND Group1 = ?`;
        queryParams.push(req.mainCategory);
    }

    // subCategory가 존재하는 경우 조건 추가
    if (req.subCategory && req.subCategory !== "") {
        query += ` AND Group2 = ?`;
        queryParams.push(req.subCategory);
    }

    if (req.priceFrom && req.priceTo && req.priceFrom <= req.priceTo) {
        query += ` AND (Price BETWEEN ? AND ?)`;
        queryParams.push(req.priceFrom);
        queryParams.push(req.priceTo);
    }

    // searchQuery가 존재하는 경우 조건 추가 (부분 일치 검색)
    if (req.searchQuery && req.searchQuery !== "") {
        query += ` AND Title LIKE ?`;
        queryParams.push(`%${req.searchQuery}%`);
    }

    // 정렬 옵션 추가
    if (req.sortOption) {
        if (req.sortOption === "최신 순") {
            query += ` ORDER BY Reg_date DESC`;
        } else if (req.sortOption === "좋아요 많은 순" || req.sortOption === "찜 많은 순") {
            query += ` ORDER BY Like_cnt DESC`;
        }
    }

    // 쿼리 실행
    connection.query(query, queryParams, (err, rows) => {
        if (err) {
            console.error("게시물 검색 중 오류 발생:", err);
            callback(err, null);
        } else {
            console.log("검색 결과:", JSON.stringify(rows));
            callback(null, rows);
        }
    });
};
