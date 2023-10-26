const Review = require("../models/reviewModel");
const AppError = require("../utils/appError");
const catchAsync = require("express-async-handler");
const handlerFactory = require("../controllers/handlerFactory");
const { Model } = require("mongoose");

const getAllReviews = handlerFactory.getAll(Review);
const getReviewById = handlerFactory.getOne(Review);
const updateReview = handlerFactory.updateOne(Review);
const deleteReview = handlerFactory.deleteOne(Review);
const createReview = catchAsync(async (req, res) => {
  const product = req.params.productId;
  const user = req.user.id;
  const { rating, reviewText } = req.body;
  const review = await Review.create({ product, user, rating, reviewText });
  if (!review) throw new AppError("fail created", 400);
  res.status(201).json({
    status: "success",
    data: { review },
  });
});

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
