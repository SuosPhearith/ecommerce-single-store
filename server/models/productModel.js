const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "product must have name"],
      minlength: 3,
      unique: true,
      trim: true,
      match: [/^[A-Za-z]+$/, "The firstname allow only letters"],
    },
    description: {
      type: String,
      required: [true, "product must have description"],
      minlength: 3,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "product must have price"],
      min: 0,
    },
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: [true, "product must have category"],
    },
    stockLevel: {
      type: Number,
      required: [true, "product must have stock level"],
    },
    brand: String,
    discount: Number,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    imageCover: {
      type: String,
      required: [true, "product must have a cover image"],
    },
    images: [String],
    createdDate: {
      type: Date,
      default: Date.now,
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Product = mongoose.model("products", productSchema);
const initialize = async () => {
  Product.init();
};
initialize();

module.exports = Product;
