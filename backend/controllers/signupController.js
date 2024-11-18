var userModel = require('../models/userModel');

exports.insertUser = (req, res, next) => {
	console.log("req: " + JSON.stringify(req.body));
    userModel.insertUser(req.body, (status) => {
        if (status === 'DB_DUPLICATE_ERROR') {
            res.status(409).json(status);
        } else if(status === 'DB_ERROR'){
			res.status(500).json(status);
        }
		else{
            res.status(200).json(status); // 실패 메시지 반환
		}
    });
}
