const authController = require("../controllers/authController");
const categoryController = require("../controllers/categoryController");
const upload = require("../middleware/upload");
const express = require("express");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(categoryController.getAllCategories)
  .post(
    authController.restrictTo("admin"),
    upload.single("imageCover"),
    categoryController.createCategory
  );
router
  .route("/:id")
  .get(categoryController.getCategoryById)
  .patch(
    authController.restrictTo("admin"),
    upload.single("imageCover"),
    categoryController.updateCategoy
  )
  .delete(
    authController.restrictTo("admin"),
    categoryController.deleteCategory
  );

module.exports = router;
