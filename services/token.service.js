const jwt = require("jsonwebtoken");
const access_secret = process.env.ACCESS_TOKEN_SECRET;
const refresh_secret = process.env.REFRESH_TOKEN_SECRET;

module.exports.getAccessToken = (user) => {
    return new Promise((resolve, reject) => {
        jwt.sign(user, access_secret, { expiresIn: "10s" }, (err, token) => {
            if (err) reject(err);
            resolve(token);
        });
    });
};

module.exports.getRefreshToken = (username) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            { username },
            refresh_secret,
            { expiresIn: "20s" },
            (err, token) => {
                if (err) reject(err);
                resolve(token);
            }
        );
    });
};

module.exports.verifyAccessToken = (accessToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(accessToken, access_secret, (err, decode) => {
            if (err) reject(err);
            resolve(decode.username);
        });
    });
};

module.exports.verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, refresh_secret, (err, decode) => {
            if (err) reject(err);
            resolve(decode.username);
        });
    });
};
