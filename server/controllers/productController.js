const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const catchAsync = require("express-async-handler");
const handlerFactory = require("../controllers/handlerFactory");

const getAllProducts = handlerFactory.getAll(Product);
const getProductById = handlerFactory.getOne(Product);
const deleteProduct = handlerFactory.deleteOne(Product);
const createProduct = catchAsync(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    imageCover: req.file ? req.file.filename : undefined,
  });
  if (!product) throw new AppError("fail created", 400);
  res.status(201).json({
    status: "success",
    data: { product },
  });
});
const updateProduct = catchAsync(async (req, res) => {
  const updateProduct = await Product.findByIdAndUpdate(
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
  if (!updateProduct) throw new AppError("Product not found", 404);
  res.status(200).json({
    status: "success",
    data: { updateProduct },
  });
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
