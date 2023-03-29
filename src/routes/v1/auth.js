const { Router } = require("express");
const {
  authenticateToken,
  checkUserRole,
} = require("../../middlewares/authenticate");
const {
  getAllUser,
  loginUser,
  refresh,
  googleOauthRedirect,
  verifyEmail,
  resendVerificationEmail,
  activeUser,
  logout,
} = require("../../controllers/authController");

const { createUser } = require("../../controllers/userController");

const router = Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/refresh", refresh);
router.get("/verify/:id/:token", verifyEmail);
router.post("/resendEmail", resendVerificationEmail);
router.get(
  "/getAllUsers",
  authenticateToken,
  checkUserRole("Admin"),
  getAllUser
);
router.get("/googleOauthRedirect", googleOauthRedirect);
router.get("/activeUser", authenticateToken, activeUser);
router.post("/logout", logout);

module.exports = router;
