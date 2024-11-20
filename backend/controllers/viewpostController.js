const db = require("../models/viewpostModel");

exports.getPost = async (req, res) => {
    const { uid, regDate } = req.query;
    console.log("Received uid:", uid); // 디버깅
    console.log("Received regDate:", regDate); // 디버깅

    if (!uid || !regDate) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    try {
        const post = await db.getPost(uid, regDate);
        if (post) {
            if (post.Image && Buffer.isBuffer(post.Image)) {
                post.Image = post.Image.toString("base64");
            }
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

