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
    // Validate email and password
    if (!email || !password) {
      res.json({ error: "enter your credentials" });
    }

    // Check for the user
    const user = await User.findOne({ email: email }).select("+password");

    if (!user) {
      res.status(401).json({ error: "invalid credentials" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({ error: "invalid credentials" });
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: user.id,
          role: user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
      { email: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    // Send accessToken containing username and roles
    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
}

// @desc Get Active User
// @route POST /api/v1/auth/activeUser
// @access Public
async function refresh(req, res, next) {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const user = await User.findOne({
        id: decoded.id,
      }).exec();

      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: user.id,
            roles: user.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  );
}

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
    const user = await User.findById(req.user).exec();
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}

// @desc Get Active User
// @route POST /api/v1/auth/logout
// @access Public
async function logout(req, res, next) {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", {
    //httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.json({ message: "Cookie cleared" });
}

module.exports = {
  getAllUser,
  loginUser,
  refresh,
  apiPage,
  activeUser,
  logout,
};
