var userModel = require('../models/userModel');
var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');

dotenv.config();
const KEY = process.env.SECRET_KEY;

exports.loginUser = (req, res, next) => {
    console.log("req: " + JSON.stringify(req.body));
    userModel.loginUser(req.body, (status, user) => { // 콜백이 상태와 사용자 데이터를 반환
        if (status === 'success') {
            const token = jwt.sign(
                { userID: user.Id, userPwd: user.Passwd, auth: user.Auth },
                KEY,
                { expiresIn: '3h' }
            );

            res.json({ message: 'success', token: token, user: user }); // 사용자 정보를 반환
        } else {
            res.json({ message: status }); // 실패 메시지 반환
        }
    });
};