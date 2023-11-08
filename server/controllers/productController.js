const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const catchAsync = require("express-async-handler");
const sharp = require("sharp");
const multer = require("multer");
const handlerFactory = require("../controllers/handlerFactory");

const getAllProducts = handlerFactory.getAll(Product);
const getProductById = handlerFactory.getOne(Product);
const deleteProduct = handlerFactory.deleteOne(Product);
const createProduct = handlerFactory.createOne(Product);
const updateProduct = handlerFactory.updateOne(Product);

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

const uploadProductImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

// upload.single('image') req.file
// upload.array('images', 5) req.files

const resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();
  // 1) Cover image
  req.body.imageCover = `product-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/images/products/${req.body.imageCover}`);

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/products/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
};
