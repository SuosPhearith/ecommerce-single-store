const catchAsync = require("express-async-handler");
const Users = require("../models/userModel");
const AppError = require("../utils/appError");
const multer = require("multer");
const sharp = require("sharp");

const getAllUsers = catchAsync(async (req, res) => {
  const users = await Users.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});
const getUserById = catchAsync(async (req, res) => {
  const user = await Users.findById(req.params.id);
  if (!user) throw new AppError("user not found", 404);
  res.status(200).json({
    status: "success",
    data: { user },
  });
});
const createUser = catchAsync(async (req, res, next) => {
  const { fullname, email, password, role } = req.body;
  if (!fullname || !email || !password || !role)
    throw new AppError("all fields are required", 400);
  const user = await Users.create({ fullname, email, password, role });
  res.status(201).json({
    status: "success",
    data: { user },
  });
});
const updateMe = catchAsync(async (req, res) => {
  const filteredBody = filterObj(req.body, "fullname");
  if (req.file) filteredBody.photo = req.file.filename;
  const user = await Users.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new AppError("user not found", 404);
  res.status(201).json({
    status: "success",
    data: { user },
  });
});
const updateUser = catchAsync(async (req, res) => {
  if (req.file) req.body.photo = req.file.filename;
  const user = await Users.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new AppError("user not found", 404);
  res.status(201).json({
    status: "success",
    data: { user },
  });
});
const deleteUser = async (req, res) => {
  const user = await Users.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    data: { user },
  });
};
const banUser = catchAsync(async (req, res) => {
  const user = await Users.findOne({ _id: req.params.id }).select("+active");
  if (!user) throw new AppError("user not found", 404);
  user.active = false;
  await user.save();
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
const unbanUser = catchAsync(async (req, res) => {
  const user = await Users.findOne({ _id: req.params.id }).select("+active");
  if (!user) throw new AppError("user not found", 404);
  user.active = true;
  await user.save();
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadUserPhoto = upload.single("photo");

const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/images/users/${req.file.filename}`);

  next();
});
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateMe,
  deleteUser,
  banUser,
  unbanUser,
  uploadUserPhoto,
  resizeUserPhoto,
};
