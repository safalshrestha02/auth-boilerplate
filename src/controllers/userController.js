const User = require("../models/User");
require("dotenv").config;
// Will contain all the user controllers like Create, Edit, Delete

// @desc Register
// @route POST /api/v1/auth/register
// @access Public
async function registerUser(req, res, next) {
  try {
    const { name, email, password, role } = req.body;
    const findingUser = await User.findOne({ email });

    if (findingUser) {
      throw new Error("Email is already Registered");
    }
    // Create user

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      res.status(201).json({ success: true, user: user });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = { registerUser };
