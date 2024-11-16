var userModel = require('../models/userModel');

exports.insertUser = (req, res, next) => {
	console.log("req: " + JSON.stringify(req.body));
	userModel.insertUser(req.body, () => {
		//res.redirect('/main');
	})
}
