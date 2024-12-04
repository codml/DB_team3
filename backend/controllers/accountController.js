var accountModel = require('../models/accountModel');
const nodemailer = require('nodemailer');

require('dotenv').config();

const FROM_EMAIL_USER = process.env.EMAIL_USER;
const FROM_EMAIL_PASS = process.env.EMAIL_PASS;

exports.findID = async (req, res) => {
    console.log("요청 데이터:", JSON.stringify(req.body));

    try {
        // 데이터베이스에서 사용자 정보 조회
        const user = await accountModel.findID(req.body);

        if (!user) {
            return res.status(404).json({ message: 'fail' }); // 사용자 정보 없음
        }

        // 이메일 전송 설정
        const transporter = nodemailer.createTransport({
            service: 'naver',
            host: 'smtp.naver.com',
            port: 465,
            //secure: true,
            auth: {
                user: FROM_EMAIL_USER,
                pass: FROM_EMAIL_PASS,
            },
        });

        // 이메일 전송 내용 설정
        const mailOptions = {
            from: FROM_EMAIL_USER,
            to: req.body.userEmail,
            subject: '광운마켓에서 회원님의 아이디를 알려드립니다.',
            text: `안녕하세요!
광운마켓에서 '${req.body.userName}' 회원님의 아이디를 알려드립니다.
회원님의 아이디는 '${user.Id}'입니다.`,
        };

        // 이메일 전송
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfullsuccess');

        // 성공 응답 반환
        res.json({ message: 'success' });
    } catch (error) {
        // 에러 처리
        if (error === 'DB_ERROR') {
            console.error('Database Error:', error);
            return res.status(500).json({ message: 'fail' });
        }

        console.error('Error:', error);
        res.status(500).json({ message: 'fail' });
    }
};

exports.findPW = async (req, res) => {
    console.log("요청 데이터:", JSON.stringify(req.body));

    try {
        // 데이터베이스에서 사용자 정보 조회
        const user = await accountModel.findPW(req.body);

        if (!user) {
            return res.status(404).json({ message: 'fail' }); // 사용자 정보 없음
        }

        // 이메일 전송 설정
        const transporter = nodemailer.createTransport({
            service: 'naver',
            host: 'smtp.naver.com',
            port: 465,
            //secure: true,
            auth: {
                user: FROM_EMAIL_USER,
                pass: FROM_EMAIL_PASS,
            },
        });

        // 이메일 전송 내용 설정
        const mailOptions = {
            from: FROM_EMAIL_USER,
            to: req.body.userEmail,
            subject: '광운마켓에서 회원님의 비밀번호를 알려드립니다.',
            text: `안녕하세요!
광운마켓에서 '${user.Uname}' 회원님의 비밀번호를 알려드립니다.
회원님의 비밀번호는 '${user.Passwd}'입니다.`,
        };

        // 이메일 전송
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');

        // 성공 응답 반환
        res.json({ message: 'success'});
    } catch (error) {
        // 에러 처리
        if (error === 'DB_ERROR') {
            console.error('Database Error:', error);
            return res.status(500).json({ message: 'fail' });
        }

        console.error('Error:', error);
        res.status(500).json({ message: 'fail' });
    }
};