const crypto = require("crypto");

//generates a random token for tmail verification

async function generateToken() {
  crypto.randomBytes(64).toString("hex");
}

module.exports = { generateToken };
