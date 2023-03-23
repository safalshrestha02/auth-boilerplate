const { Router } = require("express");
const { authenticateToken } = require("../../middlewares/authenticate");
const {
  registerUser,
  getAllUser,
  loginUser,
  apiPage,
  activeUser,
} = require("../../controllers/auth");

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getAllUsers", getAllUser);
router.get("/api", apiPage);
router.get("/activeUser", authenticateToken, activeUser);

module.exports = router;
