const catchAsync = require("express-async-handler");
const Category = require("../models/categoryModel");
const AppError = require("../utils/appError");

const getAllCategories = catchAsync(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({
    status: "success",
    results: categories.length,
    data: { categories },
  });
});
const getCategoryById = catchAsync(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id });
  if (!category) throw new AppError("category not found", 404);
  res.status(200).json({
    status: "success",
    data: { category },
  });
});
const createCategory = catchAsync(async (req, res) => {
  const category = await Category.create({
    ...req.body,
    imageCover: req.file ? req.file.filename : undefined,
  });
  if (!category) throw new AppError("fail created", 400);
  res.status(201).json({
    status: "success",
    data: { category },
  });
});
const updateCategoy = catchAsync(async (req, res) => {
  const updateCategory = await Category.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
      imageCover: req.file ? req.file.filename : undefined,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateCategory) throw new AppError("category not found", 404);
  res.status(200).json({
    status: "success",
    data: { updateCategory },
  });
});
const deleteCategory = catchAsync(async (req, res) => {
  const deleteCatetory = await Category.findByIdAndDelete(req.params.id);
  if (!deleteCatetory) throw new AppError("category not found", 404);
  res.status(200).json({
    status: "success",
    data: { deleteCatetory },
  });
});

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoy,
  deleteCategory,
};
