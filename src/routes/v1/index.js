const { Router } = require("express");
const auth = require("./auth");

const router = Router();

router.use("/v1/auth", auth);

module.exports = router;
