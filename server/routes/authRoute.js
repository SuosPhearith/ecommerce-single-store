const express = require("express");
const authController = require("../controllers/authController");
const passport = require("passport");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: process.env.CLIENT_HOME }),
  authController.loginSocialMeia
);
router.get("/facebook", passport.authenticate("facebook", { scope: "email" }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: process.env.CLIENT_HOME,
  }),
  authController.loginSocialMeia
);
router.route("/").post(authController.login);
router.route("/register").post(authController.register);
router.route("/logout").get(authController.logout);
router.route("/loginStatus").get(authController.getLoginStatus);
router.route("/refresh").get(authController.refresh);
router
  .route("/resetPassword")
  .post(authController.protect, authController.resetPassword);

module.exports = router;
