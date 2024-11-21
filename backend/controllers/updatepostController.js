const updatepostModel = require("../models/updatepostModel");

const updatePost = async (req, res) => {
    const { Uid, Reg_date, Title, Content, New_Reg_date } = req.body;
    const Image = req.file
        ? req.file.buffer // 새 이미지
        : req.body.Image; // 기존 이미지(Base64)

    if (!Uid || !Reg_date || !Title || !Content || !New_Reg_date) {
        return res.status(400).json({ error: "필수 데이터가 누락되었습니다." });
    }

    try {
        // Prepare the data for the update
        const postData = { Uid, Reg_date, Title, Content, Image, New_Reg_date };

        // Call the model function to update the post
        const result = await updatepostModel.updatePost(postData);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "해당 게시글을 찾을 수 없습니다." });
        }

        res.status(200).json({ message: "게시글이 성공적으로 수정되었습니다." });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ error: "게시글 수정 중 오류가 발생했습니다." });
    }
};

module.exports = {
    updatePost,
};
