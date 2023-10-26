const express = require("express");
const authController = require("../controllers/authController");
const productController = require("../controllers/productController");
const reviewController = require("../controllers/reviewController");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.restrictTo("admin"),
    upload.single("imageCover"),
    productController.createProduct
  );
router
  .route("/:id")
  .get(productController.getProductById)
  .patch(authController.restrictTo("admin"), productController.updateProduct)
  .delete(authController.restrictTo("admin"), productController.deleteProduct);

router
  .route("/:productId/review")
  .post(authController.restrictTo("customer"), reviewController.createReview);

module.exports = router;
