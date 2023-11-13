const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();
router.route("/").post(authController.login);
router.route("/register").post(authController.register);
router.route("/logout").get(authController.logout);
router.route("/loginStatus").get(authController.getLoginStatus);
router.route("/refresh").get(authController.refresh);
router.route("/google").post(authController.loginWithGoogle);
router
  .route("/resetPassword")
  .post(authController.protect, authController.resetPassword);

module.exports = router;
