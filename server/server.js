const express = require('express');
const fetch = require('node-fetch');

const app = express();

const CLIENT_ID = '87de37f9-bfd1-4161-af4a-8f666809d8ea';
const CLIENT_SECRET = 'egJGjrIeFJ9C8MhfXfjyqG2wc4Wb51r7KshbPDdzR2YopVWf';
const ACCESS_TOKEN_URL = 'https://prd.kr-ccapi.hyundai.com/api/v1/user/oauth2/token';
const REDIRECTION_URI = 'http://localhost:1234/';
const USER_INFO_URL = 'https://prd.kr-ccapi.hyundai.com/api/v1/user/profile';

app.all('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:1234');
    res.header('Access-Control-Allow-Headers', 'Authorization');
    next();
});

app.get('/access', async (req, res) => {
    const { code } = req.query;
    try {
        const data = await getAccessToken(code);
        console.log(data);
        res.json(data);
    } catch (e) {
        console.log(e);
        res.json(e);
    }
});

app.get('/info', async (req, res) => {
    const token = req.header('Authorization');

    const userInfo = await (await fetch(USER_INFO_URL, {
        headers: { 'Authorization': token }
    })).json();
    res.json(userInfo);
});

const getAccessToken = async (code) => {
    const basicIdSecret = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const encodedBody = bodyToEncodedUrl({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECTION_URI
    })

    return (await fetch(ACCESS_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${basicIdSecret}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: encodedBody
    })).json();
}

function bodyToEncodedUrl(body) {
    const formBody = [];
    for (const property in body) {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(body[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    return formBody.join("&");
}

app.listen(3000, () => {
    console.log('API Proxy running');
});

// const express = require('express');
// const { createProxyMiddleware } = require("http-proxy-middleware");
//
// const server = express();
//
// const AUTH_URL = 'https://prd.kr-ccapi.hyundai.com/api/v1/user/oauth2/token';
//
// server.all('/*', (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:1234');
//     res.header('Access-Control-Allow-Headers', '*');
//     res.header('Access-Control-Allow-Methods', '*');
//     next();
// });
//
// server.use(createProxyMiddleware('/hyundai-token-proxy', {
//     target: AUTH_URL,
//     changeOrigin: true,
//     pathRewrite: {
//         '^/hyundai-token-proxy': '',
//     }
// }));
//
// server.listen(3000, () => {
//     console.log('API Proxy running');
// });