//var userModel = require('../models/userModel');
var axios = require('axios');
var dotenv = require('dotenv');

dotenv.config();

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

exports.getMap = async (req, res) => {
    const { query } = req.body; // 검색어를 쿼리 매개변수로 받음
    const url = 'https://openapi.naver.com/v1/search/local.json';

    if (!query) {
        return res.status(400).json({ error: '검색어(query)를 입력하세요.' });
    }
    // query가 문자열이고 비어 있지 않은지 확인
    if (typeof query === 'string' && query.trim() !== '') {
        console.log('유효한 검색어입니다.');
    } else {
        console.log('검색어는 비어 있거나 유효하지 않습니다.');
    }

    console.log('NAVER_CLIENT_ID:', NAVER_CLIENT_ID);
    console.log('NAVER_CLIENT_SECRET:', NAVER_CLIENT_SECRET);

    console.log(query);

    try {
        // 비동기 요청 처리
        const response = await axios.get(url, {
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID, // 환경 변수 사용
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET, // 환경 변수 사용
            },
            params: {
                query: query,
                display: 5,  // 최대 5개 결과
            },
        });

        console.log(response.data);

        res.json(response.data); // 검색 결과 반환
    } catch (error) {
        console.error('API 요청 실패:', error.message);
        res.status(500).json({ error: 'API 요청에 실패했습니다.',});
    }
};
