const updatepostModel = require("../models/updatepostModel");

const updatePost = (req, res) => {
    const { Title, Uid, Content, Reg_Date } = req.body;
    let image = null;

    // 이미지 파일이 있는 경우
    if (req.file) {
        image = req.file.buffer;
    }

    const query = `
    UPDATE board 
    SET Title = ?, Content = ?, ${image ? 'Image = ?,' : ''} Reg_Date = ?
    WHERE Uid = ? AND id = ?
  `;

    const values = image
        ? [Title, Content, image, Reg_Date, Uid, req.body.id]
        : [Title, Content, Reg_Date, Uid, req.body.id];

    updatepostModel.connection.query(query, values, (error, results) => {
        if (error) {
            console.error("게시글 수정 중 오류 발생:", error);
            res.status(500).json({ error: "게시글 수정 실패" });
            return;
        }
        res.status(200).json({ message: "게시글이 성공적으로 수정되었습니다." });
    });
};

const deletePost = (req, res) => {
    const query = "DELETE FROM board WHERE id = ?";

    updatepostModel.connection.query(query, [req.body.id], (error, results) => {
        if (error) {
            console.error("게시글 삭제 중 오류 발생:", error);
            res.status(500).json({ error: "게시글 삭제 실패" });
            return;
        }
        res.status(200).json({ message: "게시글이 성공적으로 삭제되었습니다." });
    });
};

module.exports = {
    updatePost,
    deletePost
};

