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

    connection.query('SELECT * FROM usr WHERE Id = ?;', [req.userID], function(err, rows) {
        if (err) {
            console.error("DB 오류:", err);
            callback('fail');
            return;
        }

        if (rows.length === 0) {
            console.log("아이디가 존재하지 않음");
            callback('ID fail');
            return;
        }

        const user = rows[0];
        if (user.Passwd === req.userPwd) {
            console.log("로그인 성공");
            callback('success', user); // 성공 시 사용자 데이터 반환
        } else {
            console.log("비밀번호 불일치");
            callback('PW fail');
        }
    });
};

