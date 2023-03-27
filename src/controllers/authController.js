const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config;

//Will contain all the authentication controllers like login, getActive user & logout

// @desc Login
// @route POST /api/v1/auth/login
// @access Public
async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    let refreshTokens = {};
    // Validate email and password
    if (!email || !password) {
      res.json({ error: "enter your credentials" });
    }

    // Check for the user
    const user = await User.findOne({ email: email }).select("+password");
    const id = user._id.toJSON();
    if (!user) {
      res.status(401).json({ error: "invalid credentials" });
    }
    const accessToken = jwt.sign(id, process.env.ACCESS_TOKEN_SECRET);
    const refreshToken = jwt.sign(id, process.env.REFRESH_TOKEN_SECRET);
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({ error: "invalid credentials" });
    } else {
      await User.findByIdAndUpdate(
        { _id: id },
        { $set: { refreshToken } },
        { new: true }
      );
      res
        .cookie("jwt", accessToken, {
          httpOnly: true,
          expiresIn: "1d",
        })
        .json({ user });
    }
  } catch (error) {
    next(error);
  }
}

// @desc Get Active User
// @route POST /api/v1/auth/activeUser
// @access Private
async function refresh(req, res, next) {}

// @desc Get All User
// @route POST /api/v1/auth/getAllUsers
// @access Private
async function getAllUser(req, res, next) {
  try {
    const getAllUser = await User.find();

    if (getAllUser) {
      res.json({ users: getAllUser });
    }
  } catch (error) {
    next(error);
  }
}

// @desc Get Active User
// @route POST /api/v1/auth/activeUser
// @access Private
async function apiPage() {
  try {
    //this is redirection from the google
    //we need to get code (id and access token) from the query on our redirect URI
    const code = req.query.code.toString();
    //get user with token
    //upsert user and create session and tokens and also set cookie for the user
  } catch (error) {
    next(error);
  }
}

// @desc Get Active User
// @route POST /api/v1/auth/activeUser
// @access Private
async function activeUser(req, res, next) {
  try {
    console.log(req.user);
    const user = await User.findById(req.user.id).exec();
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {}

module.exports = {
  getAllUser,
  loginUser,
  refresh,
  apiPage,
  activeUser,
  logout,
};
