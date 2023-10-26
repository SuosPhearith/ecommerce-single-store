const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
router.route("/loginStatus").get(authController.getLoginStatus);
router
  .route("/resetPassword")
  .post(authController.protect, authController.resetPassword);

router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
router.route("/banUser/:id").patch(userController.banUser);
router.route("/unbanUser/:id").patch(userController.unbanUser);

module.exports = router;
