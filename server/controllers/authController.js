const User = require("../models/userModel");
const catchAsync = require("express-async-handler");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// generateToken
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_DATE,
  });
};
// create sent token to client
const sentToken = (user, res) => {
  // remove password from newUser
  user.password = undefined;
  // generate token
  const token = generateToken(user._id);
  // sent cookie and json
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: process.env.COOKIE_EXPIRES_DATE * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    status: "success",
    token,
    data: { user },
  });
};
// register
const register = catchAsync(async (req, res) => {
  const { fullname, email, password } = req.body;
  // check user input all fields
  if (!fullname || !email || !password)
    throw new AppError("please input all fields", 400);
  // check email is exist
  const emailExist = await User.findOne({ email });
  if (emailExist) throw new AppError("email is already register", 400);
  const newUser = await User.create({ fullname, email, password });
  if (newUser) {
    sentToken(newUser, res);
  } else {
    throw new AppError("Fail register", 400);
  }
});
// login
const login = catchAsync(async (req, res) => {
  // get email and password from users
  const { email, password } = req.body;
  if (!email || !password) throw new AppError("please input all feilds", 400);
  // check email is exist
  const user = await User.findOne({ email }).select("+password +active");
  if (!user) throw new AppError("Incorrect email", 400);
  // if email exist go to check password
  const passwordDB = user.password;
  // check account ban or not
  if (!user.active) throw new AppError("account was ban", 403);
  const checkPasssword = await bcrypt.compare(password, passwordDB);
  if (checkPasssword) {
    sentToken(user, res);
  } else {
    throw new AppError("Incorrect password", 400);
  }
});
// logout
const logout = catchAsync(async (req, res) => {
  // clear token in cookie
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    maxAge: process.env.COOKIE_EXPIRES_DATE * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({ message: "success" });
});
// protect
const protect = catchAsync(async (req, res, next) => {
  // get token from header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // check token is exist
  if (!token)
    throw new AppError(
      "You are not logged in! Please log in to get access.",
      401
    );
  // verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // check user is still exist
  const currentUser = await User.findOne({ _id: decoded.id }).select("+active");
  // continue
  if (!currentUser) {
    throw new AppError(
      "The user belonging to this token does no longer exist",
      401
    );
  } else {
    // check account ban or not
    if (!currentUser.active) throw new AppError("account was ban", 403);
    req.user = currentUser;
    next();
  }
});
// restrictTo
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};
// login status
const getLoginStatus = catchAsync(async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json(false);
  // verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (decoded) return res.json(true);
  else return res.json(false);
});
// reset password
const resetPassword = catchAsync(async (req, res) => {
  // get data from user
  const { password, newPassword, confirmNewPassword } = req.body;
  // check validation
  if (!password || !newPassword || !confirmNewPassword)
    throw new AppError("all fields are required", 400);
  else if (newPassword !== confirmNewPassword)
    throw new AppError("check your confirm password", 400);
  // get this user
  const user = await User.findOne({ _id: req.user.id }).select("+password");
  // save password bcrypt in passwordDB
  const passwordDB = user.password;
  // verify password
  const verifyPassword = await bcrypt.compare(password, passwordDB);
  if (!verifyPassword) throw new AppError("incorrect password", 400);
  // update to new password
  user.password = newPassword;
  // save to database
  await user.save();
  // remove password before sent back to client
  user.password = undefined;
  res.status(200).json({
    status: "success",
    data: { user },
  });
});
module.exports = {
  register,
  login,
  logout,
  protect,
  restrictTo,
  getLoginStatus,
  resetPassword,
};
