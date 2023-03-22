const { Router } = require("express");
const {
  registerUser,
  getAllUser,
  loginUser,
} = require("../../controllers/auth");

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getAllUsers", getAllUser);

module.exports = router;
