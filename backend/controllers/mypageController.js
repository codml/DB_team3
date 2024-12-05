const mypageModel = require('../models/mypageModel');

var jwt = require('jsonwebtoken');
var dotenv = require('dotenv');

dotenv.config();
const KEY = process.env.SECRET_KEY;


exports.getUserInformation = (req, res, next) => {
	console.log('Call getUserInformation');
    const authHeader = req.headers['authorization']; // Authorization 헤더에서 토큰 추출
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // 'Bearer <token>' 형태에서 토큰 부분만 추출
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    // 토큰 검증 및 디코딩
	const decoded = jwt.verify(token, KEY);

	// 유저 ID 추출
	userID = decoded.userID;

	// send ID to model
	mypageModel.getUser(userID, (status, user) => {
		if(status === 'success'){
			if (user.Profile_image)
				user.Profile_image = Buffer.from(user.Profile_image).toString('base64');
			return res.status(200).json({ message: 'Loading user information success', user: user });
		}
		else
			return res.status(401).json({ message: status });
	});
};

exports.modifyUserInformation = (req, res, next) => {
	console.log('Call modifyUserInformation');
	const { body } = req;
	const { file } = req;

	console.log("수신된 데이터:", body); // 기타 사용자 데이터
	console.log("업로드된 파일:", file); // 업로드된 파일 정보

	if (file) {
		body.Profile_image = req.file.buffer;
    }

	console.log('body check: ' + JSON.stringify(body.Nickname));
	// null 체크
	for (const key in body) {
		if (body[key] === '')
			body[key] = null;
	}
	
	mypageModel.modifyUser(body, status => {
		if(status === 'success'){
			return res.status(200).json({ message: 'Update user information success'});
		}
		else
			return res.status(401).json({ message: status });
	})
	
};


// get____Items 구조 다 똑같음. 단지 mypageModel의 함수만 다름
exports.getSaleItems = (req, res, next) => {
	console.log('Call getSaleItems');
	
	const authHeader = req.headers['authorization']; // Authorization 헤더에서 토큰 추출
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // 'Bearer <token>' 형태에서 토큰 부분만 추출
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    // 토큰 검증 및 디코딩
	const decoded = jwt.verify(token, KEY);

	// 유저 ID 추출
	userID = decoded.userID;

	// send ID to model
	mypageModel.getSaleItems(userID, (status, items) => {
		if(status === 'success'){
			items.forEach((item, index, arr) => {
				arr[index].Image = Buffer.from(item.Image).toString('base64');
			});
			return res.status(200).json({ message: 'Loading user information success', items: items });
		}
		else
			return res.status(401).json({ message: status });
	});
};

exports.getPurchaseItems = (req, res, next) => {
	console.log('Call getPurchaseItems');
	
	const authHeader = req.headers['authorization']; // Authorization 헤더에서 토큰 추출
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // 'Bearer <token>' 형태에서 토큰 부분만 추출
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    // 토큰 검증 및 디코딩
	const decoded = jwt.verify(token, KEY);

	// 유저 ID 추출
	userID = decoded.userID;

	// send ID to model
	mypageModel.getPurchaseItems(userID, (status, items) => {
		if(status === 'success'){
			items.forEach((item, index, arr) => {
				arr[index].Image = Buffer.from(item.Image).toString('base64');
			});
			return res.status(200).json({ message: 'Loading user information success', items: items });
		}
		else
			return res.status(401).json({ message: status });
	});
};

exports.getLikeItems = (req, res, next) => {
	console.log('Call getLikeItems');
	
	const authHeader = req.headers['authorization']; // Authorization 헤더에서 토큰 추출
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // 'Bearer <token>' 형태에서 토큰 부분만 추출
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    // 토큰 검증 및 디코딩
	const decoded = jwt.verify(token, KEY);

	// 유저 ID 추출
	userID = decoded.userID;

	// send ID to model
	mypageModel.getLikeItems(userID, (status, items) => {
		if(status === 'success'){
			items.forEach((item, index, arr) => {
				arr[index].Image = Buffer.from(item.Image).toString('base64');
			});
			return res.status(200).json({ message: 'Loading user information success', items: items });
		}
		else
			return res.status(401).json({ message: status });
	});
};

exports.getRpUserList = (req, res, next) => {
	console.log('Call getRpUserList');
	
	const authHeader = req.headers['authorization']; // Authorization 헤더에서 토큰 추출
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // 'Bearer <token>' 형태에서 토큰 부분만 추출
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    // 토큰 검증 및 디코딩
	const decoded = jwt.verify(token, KEY);

	// 유저 ID 추출
	userID = decoded.userID;

	mypageModel.getRpUserList((status, reports) => {
		if(status === 'success'){
			return res.status(200).json({ message: 'Loading user information success', reports: reports });
		}
		else
			return res.status(401).json({ message: status });
	});
};

// 신고 당한 유저 정보 가져오기
exports.getRpUser = (req, res, next) => {
	console.log('Call getRpUser');
	
	const userId = req.headers.id;
	console.log('userId: ' + userId);
	mypageModel.getRpUser(userId, (status, user) => {
		if(status === 'success'){
			if(user.Profile_image)
				user.Profile_image = Buffer.from(user.Profile_image).toString('base64')
			return res.status(200).json({ message: 'Loading user information success', user: user });
		}
		else
			return res.status(401).json({ message: status });
	});
};

// 신고 당한 유저의 글
exports.getRpList = (req, res, next) => {
	console.log('Call getRpList');
	
	const userId = req.headers.id;
	console.log('userId: ' + userId);
	mypageModel.getRpList(userId, (status, lists) => {
		if(status === 'success'){
			return res.status(200).json({ message: 'Loading user information success', lists: lists });
		}
		else
			return res.status(401).json({ message: status });
	});
};

// 신고 당한 유저 밴하기
exports.banUser = (req, res, next) => {
	console.log('Call banUser');
	
	const userId = req.body.Id; // 요청 본문 데이터
	console.log('userId: ' + userId);
	mypageModel.banUser(userId, (status) => {
		if(status === 'success'){
			return res.status(200).json({ message: 'To ban user success'});
		}
		else
			return res.status(401).json({ message: status });
	});
};