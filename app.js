var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// routs
app.use("/", require("./routes/user_management/user_registration"));
app.use("/", require("./routes/user_management/user_login"));
app.use("/", require("./routes/user_management/update_user"));


app.use("/", require("./routes/get_api/product_list"));
// app.use("/", require("./routes/get_api/get_bill"));
app.use("/", require("./routes/get_api/order_list"));


app.use("/", require("./routes/post_api/add_product"));
app.use("/", require("./routes/post_api/new_order"));
app.use("/", require("./routes/post_api/order_deliver"));
app.use("/", require("./routes/post_api/cancel_order"));

app.use("/", require("./routes/update/update_milk_price"));

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
