var userModel = require('../models/userLocationModel.js');

exports.getLocation = (req, res) => {
    console.log("req: " + JSON.stringify(req.body));
    userLocationModel.userLocation(req.body, (status, location) => { // 콜백이 상태와 사용자 데이터를 반환
        if (status === 'success') {
            res.json({ message: 'success', userLocation: location }); // 사용자 정보를 반환
        } else {
            res.json({ message: status }); // 실패 메시지 반환
        }
    });
};