var searchModel = require('../models/searchModel');

exports.searchItems = (req, res) => {
	console.log("req: " + JSON.stringify(req.query));
	searchModel.searchItems(req.query, (err, rows) => {
        if (err) {
            console.log("query error\n");
        } else {
		    res.json(rows);
        }
	})
}