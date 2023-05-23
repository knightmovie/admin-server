const authService = require("../services/auth.service");

module.exports.logout = async (req, res) => {
    try {
        await authService.logout(req, res);
    } catch (err) {
        return res.status(err.status).send(err.message);
    }
};
