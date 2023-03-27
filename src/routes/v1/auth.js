const { Router } = require("express");
const { authenticateToken } = require("../../middlewares/authenticate");
const {
  getAllUser,
  loginUser,
  refresh,
  apiPage,
  activeUser,
  logout,
} = require("../../controllers/authController");

const { registerUser } = require("../../controllers/userController");

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/refresh", refresh);
router.get("/getAllUsers", authenticateToken, getAllUser);
router.get("/api", apiPage);
router.get("/activeUser", authenticateToken, activeUser);
router.post("/logout", logout);

module.exports = router;
