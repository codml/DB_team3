const mypageModel = require('../models/mypageModel');

var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');

dotenv.config();
const KEY = process.env.SECRET_KEY;

exports.getUserInformation = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Authorization 헤더에서 토큰 추출
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // 'Bearer <token>' 형태에서 토큰 부분만 추출
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    // 토큰 검증 및 디코딩
	const decoded = jwt.verify(token, KEY);

	// 유저 ID 추출
	req.userID = decoded.userID;
	console.log("userId: " + req.userID);

	// send ID to model
	mypageModel.getUser(req, (status, user) => {
		if(status === 'success')
			return res.status(200).json({ message: 'Loading user information success', user: user });
		else
			return res.status(401).json({ message: status });
	});
};