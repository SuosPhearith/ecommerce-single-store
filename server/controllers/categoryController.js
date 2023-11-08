const catchAsync = require("express-async-handler");
const Category = require("../models/categoryModel");
const AppError = require("../utils/appError");
const handlerFactory = require("../controllers/handlerFactory");
const sharp = require("sharp");
const multer = require("multer");

const getAllCategories = handlerFactory.getAll(Category);
const getCategoryById = handlerFactory.getOne(Category);
const createCategory = handlerFactory.createOne(Category);
const deleteCategory = handlerFactory.deleteOne(Category);
const updateCategoy = catchAsync(async (req, res) => {
  if (req.file) req.body.photo = req.file.filename;
  const updateCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
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

const uploadCategoryPhoto = upload.single("photo");

const resizeCategoryPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `category-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/images/categories/${req.file.filename}`);

  next();
});
module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoy,
  deleteCategory,
  uploadCategoryPhoto,
  resizeCategoryPhoto,
};
