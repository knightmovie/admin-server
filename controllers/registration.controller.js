const mongoose = require("mongoose");
const user = mongoose.model("User");
const bcrypt = require("bcrypt");

module.exports.register = (req, res) => {
    console.log("registering user");
    user.create({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)),
    })
        .then((user) => {
            console.log("user registered succesfully!!", user);
            res.status(201).json(user);
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
};
