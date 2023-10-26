const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");
const express = require("express");

const router = express.Router();

router.use(authController.protect);

router.route("/").get(reviewController.getAllReviews);
router
  .route("/:id")
  .get(reviewController.getReviewById)
  .patch(
    authController.restrictTo("customer", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo("customer", "admin"),
    reviewController.deleteReview
  );

module.exports = router;
