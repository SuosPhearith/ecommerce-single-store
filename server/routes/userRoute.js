const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/:id")
  .get(userController.getUserById)
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
  )
  .delete(userController.deleteUser);

router.use(authController.restrictTo("admin"));
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/modify/:id")
  .patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateUser
  );
router.route("/banUser/:id").patch(userController.banUser);
router.route("/unbanUser/:id").patch(userController.unbanUser);

module.exports = router;
