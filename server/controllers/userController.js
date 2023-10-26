const catchAsync = require("express-async-handler");
const Users = require("../models/userModel");
const AppError = require("../utils/appError");

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
const updateUser = catchAsync(async (req, res) => {
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

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  banUser,
  unbanUser,
};
