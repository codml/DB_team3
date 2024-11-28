const mysql = require('mysql');

// MySQL 연결 설정
const connection = mysql.createConnection({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'MySQLpass',
    database: 'db_market'
});


exports.getUser = (userID, callback) => {
	console.log('Call getUser');
	connection.query('SELECT * FROM usr WHERE Id = ?;', [userID], function(err, rows) {
        if (err) {
            console.error("DB 오류");
            callback('fail');
            return;
        }

        if (rows.length === 0) {
            console.log("아이디가 존재하지 않음");
            callback('ID not exist');
            return;
        }

		const user = rows[0];
		callback('success', user); // 성공 시 사용자 데이터 반환
    });
};

exports.modifyUser = (userData, callback) => {
	console.log('Call modifyUser');
	var sql;
	if(userData.Profile_image){
		sql = "UPDATE usr SET Uname = ?, Age = ?, Sex = ?, Phone = ?, Email = ?, Address = ?, Passwd = ?, Nickname = ?, Profile_image = ? WHERE id = ?";
		sqldata = [userData.Uname, userData.Age, userData.Sex, userData.Phone, userData.Email, userData.Address, userData.Passwd, userData.Nickname, userData.Profile_image, userData.Id];	
	}else{
		sql = "UPDATE usr SET Uname = ?, Age = ?, Sex = ?, Phone = ?, Email = ?, Address = ?, Passwd = ?, Nickname = ? WHERE id = ?";
	}
	sqldata = [userData.Uname, userData.Age, userData.Sex, userData.Phone, userData.Email, userData.Address, userData.Passwd, userData.Nickname, userData.Id];
	connection.query(sql, sqldata, (err, rows) => {
		if (err) {
		  console.error('sql error message: ' + err.sqlMessage);
		  callback(err.sqlMessage);
		  return;
		}
		console.log("업데이트 결과:", rows);
		callback('success');
	  });
};

exports.getSaleItems = (userID, callback) => {
	console.log('Call getSaleItems');
	var sql = 'SELECT * FROM item_datas WHERE Uid = ?;';
	connection.query(sql, userID, (err, rows) => {
		if (err) {
            console.error("DB 오류");
            callback('fail');
            return;
        }

        if (rows.length === 0) {
            console.log("판매상품이 존재하지 않음");
            callback('Item not exists');
            return;
        }
		callback('success', rows); // 성공 시 사용자 데이터 반환
	  });
};


exports.getPurchaseItems = (userID, callback) => {
	console.log('Call getPurchaseItems');
	var sql = 'SELECT * FROM item_datas WHERE B_uid = ? ORDER BY Reg_date;';
	connection.query(sql, userID, (err, rows) => {
		if (err) {
            console.error("DB 오류" + err.sqlMessage);
            callback('fail');
            return;
        }

        if (rows.length === 0) {
            console.log("구매상품이 존재하지 않음");
            callback('Item not exists');
            return;
        }
		callback('success', rows); // 성공 시 사용자 데이터 반환
	  });
};