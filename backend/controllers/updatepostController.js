const updatepostModel = require("../models/updatepostModel");

exports.updatePost = (req, res, next) => {
    const { Uid, Reg_date, Title, Content, New_Reg_date } = req.body;

    // 이미지 처리 로직 명확화
    let Image;
    if (req.file) {
        Image = req.file.buffer; // 새로 업로드된 이미지
    } else if (req.body.Image === "delete") {
        Image = null; // 명시적으로 이미지 삭제
    } else if (req.body.Image === "original") {
        Image = undefined; // 기존 이미지 유지
    } else {
        Image = req.body.Image; // Base64 등 다른 형태
    }

    if (!Uid || !Reg_date || !Title || !Content || !New_Reg_date) {
        return res.status(400).json({ error: "필수 데이터가 누락되었습니다." });
    }

    try {
        // 이미지가 undefined가 아닌 경우에만 postData에 포함
        const postData = {
            Uid,
            Reg_date,
            Title,
            Content,
            New_Reg_date
        };

        if (Image !== undefined) {
            postData.Image = Image;
        }

        updatepostModel.updatePost(postData, (error, result) => {
            if (error) {
                console.error("DB Update Error:", error);
                return res.status(500).json({ error: "게시글 수정 중 오류가 발생했습니다." });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "해당 게시글을 찾을 수 없습니다." });
            }

            res.status(200).json({ message: "게시글이 성공적으로 수정되었습니다." });
        });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ error: "게시글 수정 중 오류가 발생했습니다." });
    }
};