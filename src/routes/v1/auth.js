const { Router } = require("express");
const { authenticateToken } = require("../../middlewares/authenticate");
const {
  registerUser,
  getAllUser,
  loginUser,
  apiPage,
  activeUser,
  logout,
} = require("../../controllers/auth");

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getAllUsers", getAllUser);
router.get("/api", apiPage);
router.get("/activeUser", authenticateToken, activeUser);
router.patch("/logout", logout);

module.exports = router;
