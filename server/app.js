const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const passport = require("passport");
const expressSession = require("express-session");
const cors = require("cors");

const app = express();
// new
const corsOptions = {
  origin: process.env.CORS_ACCESS,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//MIDDLEWARE
require("./controllers/passport");
app.use(cookieParser());
app.use(express.json());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// ROUTES

app.use("/api/v1/user", require("./routes/userRoute"));
app.use("/api/v1/auth", require("./routes/authRoute"));
app.use("/api/v1/category", require("./routes/categoryRoute"));
app.use("/api/v1/product", require("./routes/productRoute"));
app.use("/api/v1/review", require("./routes/reviewRoute"));

// ERROR HANDLER

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in application`), 404);
});

const sendErrorDev = (err, res) => {
  console.log(err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("error💥", err);
    res.status(500).json({
      error: err,
      status: "error",
      message: "Something went wrong",
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") err = handleJWTError();
    if (err.name === "TokenExpiredError") err = handleJWTExpiredError();
    sendErrorProd(err, res);
  }
});

module.exports = app;
