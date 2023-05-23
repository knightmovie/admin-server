const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const tokenService = require("./token.service");

const register = async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password)
        return res
            .status(400)
            .json({ message: "Username and password are required." });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username });
    if (duplicate) return res.sendStatus(409); //Conflict

    try {
        //encrypt the password
        const hashedPwd = bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10)
        );

        //create and store the new user
        const result = await User.create({
            username: username,
            roles: {
                Admin: role,
            },
            password: hashedPwd,
        });

        console.log(result);

        res.status(201).json({ success: `New user ${username} created!` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res
            .status(400)
            .json({ message: "Username and password are required." });

    const foundUser = await User.findOne({ username: username });
    if (!foundUser) return res.sendStatus(401); //Unauthorized
    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // create JWTs
        const accessToken = await tokenService.getAccessToken({
            UserInfo: {
                username: foundUser.username,
                roles: roles,
            },
        });
        const refreshToken = await tokenService.getRefreshToken(
            foundUser.username
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        console.log(roles);

        // Creates Secure Cookie with refresh token
        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: false,
            maxAge: 60 * 1000,
        });

        // Send authorization roles and access token to user
        res.json({ roles, accessToken });
    } else {
        res.sendStatus(401);
    }
};

const logout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: false,
        }); //
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = "";
    const result = await foundUser.save();
    console.log("clear === ", result);

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: false });
    res.sendStatus(204);
};

module.exports = {
    login,
    register,
    logout,
};
