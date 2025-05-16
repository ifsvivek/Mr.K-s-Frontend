const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/userController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const passport = require("passport");


router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("name")
      .isLength({ min: 3 })
      .withMessage("name should be 3 characters long"),
    body("password")
      .isLength({ min: 3 })
      .withMessage("Password should be at least 3 characters long"),
    body("phoneNumber")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone number should be 10 digits long")
      .optional(),
  ],
  userController.registerUser
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 3 })
      .withMessage("Password should be at least 3 characters long"),
  ],
  userController.loginUser
);

router.post(
  "/update/password",
  authMiddleware.authUser,
  [
    body("oldPassword")
      .isLength({ min: 3 })
      .withMessage("Old Password should be at least 3 characters long"),
    body("newPassword")
      .isLength({ min: 3 })
      .withMessage("New Password should be at least 3 characters long"),
  ],
 userController.updateUserPassword
);


router.get('/profile', authMiddleware.authUser, userController.getUserProfile);

router.patch(
  "/profile",
  authMiddleware.authUser,
  [
    body("email").isEmail().optional().withMessage("Invalid Email"),
    body("name").isLength({ min: 3 }).optional().withMessage("Name should be at least 3 characters long"),
    body("phone").isLength({ min: 10, max: 10 }).optional().withMessage("Phone number should be 10 digits long"),
  ],
  userController.updateUserProfile
);

router.get('/logout', authMiddleware.authUser, userController.logoutUser);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  const token = req.user.generateAuthToken();
  res.cookie('token', token, {
  httpOnly: true,
  sameSite: 'Lax',
  maxAge: 24 * 60 * 60 * 1000 
});
res.redirect('http://localhost:5173/dashboard');
});

router.get('/auth/linkedin', passport.authenticate('linkedin'));
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', { session: false }), (req, res) => {
  const token = req.user.generateAuthToken();
  res.cookie('token', token, {
  httpOnly: true,
  sameSite: 'Lax',
  maxAge: 24 * 60 * 60 * 1000
});
res.redirect('http://localhost:5173/dashboard');
});

// Verify token
router.get('/verify-token', authMiddleware.authUser, userController.verifyToken);

module.exports = router;
