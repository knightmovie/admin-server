const mongoose = require("mongoose");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const tokenService = require("../services/token.service");

module.exports.refresh = async (req, res) => {
    const cookies = req.cookies;
    console.log(cookies);
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) return res.sendStatus(403); //Forbidden
    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err || foundUser.username !== decoded.username)
                return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = await tokenService.getAccessToken({
                UserInfo: {
                    username: decoded.username,
                    roles: roles,
                },
            });
            return res.json({ roles, accessToken });
        }
    );
};
