var boardpageModel = require('../models/boardpageModel');

exports.getBoardPosts = (req, res, next) => {
    boardpageModel.fetchAllPosts((result) => {
        if (result.success) {
            res.status(200).json(result.data);
        } else {
            console.error("Fetch error:", result.error);
            res.status(500).json({ message: result.message, error: result.error });
        }
    });
};
