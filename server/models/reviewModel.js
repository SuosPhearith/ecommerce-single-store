const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming you have a User model
    required: [true, "review must have user"],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Assuming you have a Product model
    required: [true, "review must have product"],
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reviewText: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

// Create a compound unique index for user and product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.product);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.review = await this.clone().findOne();
  // console.log(this.review);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // Access the review from the pre hook
  const review = this.review;

  if (review) {
    // Calculate the updated ratings after the review is updated or deleted
    await review.constructor.calcAverageRatings(review.product);
  }
});

const Review = mongoose.model("Reviews", reviewSchema);

module.exports = Review;
