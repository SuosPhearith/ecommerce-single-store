const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, "category must have name"],
    unique: [true, "category is already exist"],
    trim: true,
    minLength: 3,
    maxLenght: 50,
  },
  categoryDescription: {
    type: String,
    trim: true,
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categories",
  },
  orderNumber: Number,
});

const Category = mongoose.model("categories", categorySchema);
const initialize = async () => {
  Category.init();
};

initialize();

module.exports = Category;
