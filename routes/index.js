const express = require("express");
const router = express.Router();

const registerCtrl = require("../controllers/register.controller");
const loginCtrl = require("../controllers/login.controller");
const logoutCtrl = require("../controllers/logout.controller");
const homeCtrl = require("../controllers/home.controller");
const refreshCtrl = require("../controllers/refresh.controller");
const { verifyJWT } = require("../middlewares/verifyJWT");

router.post("/users/register", registerCtrl.register);
router.post("/users/login", loginCtrl.login);
router.get("/home", verifyJWT, homeCtrl.home);
router.get("/refresh", refreshCtrl.refresh);
router.get("/users/logout", logoutCtrl.logout);

module.exports = router;
