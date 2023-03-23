const { Router } = require("express");
const {
  registerUser,
  getAllUser,
  loginUser,
  apiPage,
} = require("../../controllers/auth");

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getAllUsers", getAllUser);
router.get("/api", apiPage);

module.exports = router;
