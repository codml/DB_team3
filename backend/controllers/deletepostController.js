const deletePostModel = require("../models/deletepostModel");

exports.deletePost = async (req, res) => {
    const { uid, regDate } = req.body;

    console.log("uid to delete:", uid);
    console.log("Received regDate:", regDate);

    try {
        const isDeleted = await deletePostModel.deletePost(uid, regDate);

        if (isDeleted) {
            res.status(200).json({ message: "Post deleted successfully" });
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
