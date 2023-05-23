const authService = require("../services/auth.service");

module.exports.register = async (req, res) => {
    try {
        await authService.register(req, res);
    } catch (err) {
        res.status(err.status).send(err.message);
    }
};
