var mapModel = require('../models/mapModel');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const NAVER_CLIENT_CLOUD_ID = process.env.NAVER_CLIENT_CLOUD_ID;
const NAVER_CLIENT_CLOUD_SECRET = process.env.NAVER_CLIENT_CLOUD_SECRET;
const NAVER_CLIENT_APPLICATION_ID = process.env.NAVER_CLIENT_APPLICATION_ID;
const NAVER_CLIENT_APPLICATION_SECRET = process.env.NAVER_CLIENT_APPLICATION_SECRET;

if (!NAVER_CLIENT_CLOUD_ID || !NAVER_CLIENT_CLOUD_SECRET) {
    throw new Error("Missing NAVER_CLIENT_CLOUD_ID or NAVER_CLIENT_CLOUD_SECRET in environment variables");
}

exports.getUserLocation = async (req, res) => {
    console.log("Request Body:", req.body);

    if (!req.body.query) {
        return res.status(400).json({
            message: "fail",
            error: "Query parameter is required",
        });
    }

    const url = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode";
    const headers = {
        "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_CLOUD_ID,
        "X-NCP-APIGW-API-KEY": NAVER_CLIENT_CLOUD_SECRET,
    };

    try {
        const response = await axios.get(url, {
            headers,
            params: { query: req.body.query },
        });

        const addresses = response?.data?.addresses;

        console.log("address:", addresses);

        if (Array.isArray(addresses) && addresses.length > 0) {
            res.json({
                message: 'success',
                location: addresses,
            });
        } else {
            res.status(404).json({
                message: 'fail',
                error: 'No results found',
            });
        }
    } catch (error) {
        console.error('Error fetching location data:', error.message);
        res.status(500).json({
            message: 'fail',
            error: error.message || 'Unknown error occurred',
        });
    }
};

exports.getItemLocations = async (req, res) => {
    console.log("req: " + JSON.stringify(req.query));

    try {
        // 데이터베이스에서 장소 정보 조회
        mapModel.getItemLocations(req.query, async (err, rows) => {
            if (err) {
                return res.status(500).json({
                    message: 'fail',
                    error: err.message || 'Unknown error occurred',
                });
            }

            const url = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode";
            const headers = {
                "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_CLOUD_ID,
                "X-NCP-APIGW-API-KEY": NAVER_CLIENT_CLOUD_SECRET,
            };

            let addresses = [];

            // 비동기 처리를 위해 Promise.all 사용
            const addressPromises = rows.map(async (row) => {
                try {
                    const response = await axios.get(url, {
                        headers,
                        params: { query: row.Place }, // row.Place로 각 거래 장소의 주소를 사용
                    });

                    // 주소 데이터가 있으면 배열에 추가
                    if (response?.data?.addresses) {
                        response.data.addresses.forEach(address => {
                            // 필요한 정보를 객체로 저장
                            addresses.push({
                                Address: address.roadAddress || address.jibunAddress, // 도로명 주소 또는 지번 주소
                                X: address.y, // 위도
                                Y: address.x, // 경도
                                Ino: row.Ino, // 해당 장소의 URL (예시로 추가한 경우)
                                Title: row.Title,
                            });
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching address for ${row.Place}:`, error.message);
                }
            });

            // 모든 주소 요청이 끝날 때까지 대기
            await Promise.all(addressPromises);

            console.log("address:", addresses);

            if (addresses.length > 0) {
                res.json({
                    message: 'success',
                    location: addresses,
                });
            } else {
                res.status(404).json({
                    message: 'fail',
                    error: 'No results found',
                });
            }
        });
    } catch (error) {
        console.error('Error in getItemLocations function:', error.message);
        res.status(500).json({
            message: 'fail',
            error: error.message || 'Unknown error occurred',
        });
    }
};

exports.searchLocation = async (req, res) => {
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

    console.log(query);

    try {
        // 비동기 요청 처리
        const response = await axios.get(url, {
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_APPLICATION_ID, // 환경 변수 사용
                'X-Naver-Client-Secret': NAVER_CLIENT_APPLICATION_SECRET, // 환경 변수 사용
            },
            params: {
                query: query,
                display: 1,  // 최대 5개 결과
            },
        });

        console.log(response.data);
        res.json(response.data); // 검색 결과 반환
    } catch (error) {
        console.error('API 요청 실패:', error.message);
        res.status(500).json({ error: 'API 요청에 실패했습니다.' });
    }
};
