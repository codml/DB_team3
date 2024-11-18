var mysql = require('mysql');
var connection = mysql.createConnection({
	connectionLimit: 5,
	host: 'localhost',
	user: 'root',
	password: 'Mineworld527!',
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