require("dotenv").config;
const jwt = require("jsonwebtoken");
const User = require('../models/User')

authenticateToken = async (req, res, next) => {
        try {
          let token;
      
          if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
          ) {
            token = req.headers.authorization.split(" ")[1];
          } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
          }
      
          if (!token) {
            return res.json({data:" req.user"})
          }
      
          try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            req.user = await User.findById(decoded);
            next();
          } catch (error) {
            return res.json({data: req.user})
          }
        } catch (error) {
          next(error);
        }
      };

module.exports = { authenticateToken };
