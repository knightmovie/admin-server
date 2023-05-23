const express = require("express");
const mongoose = require("mongoose");

require("./models/users.model");
require("dotenv").config();
const port = process.env.PORT || "8000";
const usersRoute = require("./routes/index.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const dbURI = process.env.DB_URI + "/movies";

mongoose
    .connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connected"))
    .catch((err) => console.log(err));

mongoose.Promise = global.Promise;

app.use("/", usersRoute);

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});

module.exports = app;
