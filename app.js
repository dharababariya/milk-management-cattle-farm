var createError = require("http-errors");
var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

var app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: 600000 },
        resave: false,
        saveUninitialized: true,
        store: new knexSessionStore({
            knex: require("./helper/knex"),
            tablename: "sessions",
            sidfieldname: "sid",
            createtable: true,
            clearInterval: 1000 * 60 * 60,
        }),
    })
);
app.use(passport.initialize());
app.use(passport.session());
require("./helper/local");

// import all  routs
app.use("/", require("./routes/get_api"));
app.use("/", require("./routes/post_api"));
app.use("/", require("./routes/update_api"));
app.use("/", require("./routes/user_management"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
