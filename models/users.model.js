const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    roles: {
        User: {
            type: Number,
            default: 3333,
        },
        Editor: Number,
        Admin: Number,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: String,
});

mongoose.model("User", userSchema);
