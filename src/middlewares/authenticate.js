require("dotenv").config;
const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization; // checks the authoraization header

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  // decodes the jwt token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.UserInfo.id;
    req.role = decoded.UserInfo.role;
    next();
  });
};

// checks all the roles and its permissions
const checkUserRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return next(
        new Error(
          `User role ${req.role} is unauthorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

module.exports = { authenticateToken, checkUserRole };
