const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("fullname.firstName")
      .isLength({ min: 3, max: 20 })
      .withMessage("First name must be between 3 and 20 characters long"),
    body("fullname.lastName")
      .isLength({ min: 3, max: 20 })
      .withMessage("Last name must be between 3 and 20 characters long"),
    body("password")
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 characters long"),
  ],
  userController.registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 characters long"),
  ],
  userController.loginUser
);

router.get("/profile", authMiddleware.authUser, userController.getUserProfile);

router.get("/logout", authMiddleware.authUser, userController.logoutUser);
module.exports = router;
