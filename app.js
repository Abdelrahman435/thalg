var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var editProfileRouter = require("./routes/editProfile");
var usersRouter = require("./routes/users");
var ordersRouter = require("./routes/orders");
var driversRouter = require("./routes/drivers");
var proofDocuments = require("./routes/proofDocuments");
var dashboard = require("./routes/dashboard");
var paymentRouter = require("./routes/payment");
var offers = require("./routes/offers");

var app = express();
app.use(cors()); // Enable CORS for all routes
app.options("*", cors()); // Enable pre-flight request handling for all routes
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("upload"));



app.use("/drivers", driversRouter);
app.use("/users", usersRouter);
app.use("/editProfile", editProfileRouter);
app.use("/orders", ordersRouter);
app.use("/proofDocuments", proofDocuments);
app.use("/dashboard", dashboard);
app.use("/payment", paymentRouter);
app.use("/offers", offers);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
