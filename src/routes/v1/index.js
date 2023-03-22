const { Router } = require("express");
const registerUser = require("./auth");

const router = Router();

router.use("/v1/auth", registerUser);

module.exports = router;
