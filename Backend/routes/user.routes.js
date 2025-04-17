const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Register a new user
router.post(
  "/signup",
  [
    body("firstName")
      .isLength({ min: 3, max: 20 })
      .withMessage("First name must be between 3 and 20 characters long"),
    body("lastName")
      .isLength({ min: 3, max: 20 })
      .withMessage("Last name must be between 3 and 20 characters long"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 8, max: 20 })
      .withMessage("Password must be between 8 and 20 characters long"),
  ],
  userController.registerUser
);

// Login user
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

// Get user profile
router.get("/profile", authMiddleware.authUser, userController.getUserProfile);

// Update user profile
router.put(
  "/profile",
  [
    body("firstName")
      .optional()
      .isLength({ min: 3, max: 20 })
      .withMessage("First name must be between 3 and 20 characters long"),
    body("lastName")
      .optional()
      .isLength({ min: 3, max: 20 })
      .withMessage("Last name must be between 3 and 20 characters long"),
    body("email").optional().isEmail().withMessage("Invalid email"),
  ],
  authMiddleware.authUser,
  userController.updateUserProfile
);

// Change password
router.post(
  "/change-password",
  [
    body("currentPassword")
      .isLength({ min: 8, max: 20 })
      .withMessage("Current password must be between 8 and 20 characters long"),
    body("newPassword")
      .isLength({ min: 8, max: 20 })
      .withMessage("New password must be between 8 and 20 characters long"),
  ],
  authMiddleware.authUser,
  userController.changePassword
);

// Logout user
router.get("/logout", authMiddleware.authUser, userController.logoutUser);

module.exports = router;
