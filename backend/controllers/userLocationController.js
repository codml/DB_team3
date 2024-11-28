const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_CLOUD_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_CLOUD_SECRET;

if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    throw new Error("Missing NAVER_CLIENT_CLOUD_ID or NAVER_CLIENT_CLOUD_SECRET in environment variables");
}

exports.getLocation = async (req, res) => {
    console.log("Request Body:", req.body);

    if (!req.body.query) {
        return res.status(400).json({
            message: "fail",
            error: "Query parameter is required",
        });
    }

    const url = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode";
    const headers = {
        "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": NAVER_CLIENT_SECRET,
    };

    try {
        const response = await axios.get(url, {
            headers,
            params: { query: req.body.query },
        });

        console.log("response:", response);

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
