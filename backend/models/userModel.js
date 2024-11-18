var mysql = require('mysql');
var connection = mysql.createConnection({
	connectionLimit: 5,
	host: 'localhost',
	user: 'root',
	password: 'MySQLpass',
	database: 'db_market'
});

exports.insertUser = (req, callback) => {
	connection.query('INSERT INTO usr (Uname, Age, Sex, Phone, Email, Address, Id, Passwd) VALUES (?, ?, ?, ?, ?, ?, ?, ?); ',
		[req.name, req.age, req.gender, req.tel, req.email, req.address, req.id, req.passwd], function(err, rows){
			if(err) throw err;
			console.log("rows : " + JSON.stringify(rows));
			callback(rows);
		});	
}

exports.loginUser = (req, callback) => {
	console.log(req);
	// 아이디가 존재하는지 확인
	connection.query('SELECT * FROM usr WHERE Id = ?;', [req.userID], function(err, rows) {
		if (err) {
			console.error("DB 오류:", err);
			callback('fail');
			return;
		}

		// 아이디가 존재하지 않으면 'fail' 반환
		if (rows.length === 0) {
			console.log("아이디가 존재하지 않음");
			callback('ID fail');
			return;
		}

		// 아이디가 존재하면 비밀번호 비교
		const user = rows[0];
		if (user.Passwd === req.userPwd) {
			// 비밀번호가 일치하면 'success' 반환
			console.log("로그인 성공");
			callback('success');
		} else {
			// 비밀번호가 틀리면 'fail' 반환
			console.log("비밀번호 불일치");
			callback('PW fail');
		}
	});
}
