var userModel = require('../models/userModel');
var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');

dotenv.config();
const KEY = process.env.SECRET_KEY;

exports.loginUser = (req, res, next) => {
	console.log("req: " + JSON.stringify(req.body));
	userModel.loginUser(req.body, (rows) => {
        if(rows == 'success') {
            const token = jwt.sign(
                { userID: req.body.userID, userPwd: req.body.userPwd },
                KEY,
                { expiresIn: '3h' }
            );

            res.json({ message: rows, token: token });
        }
        else {
		    res.json(rows);
        }
	})
}