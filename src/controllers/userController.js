const User = require("../models/User");
const Token = require("../models/Token");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/sendMail");
require("dotenv").config;
// Will contain all the user controllers like Create, Edit, Delete

// @desc Register
// @route POST /api/v1/auth/register
// @access Public

async function createUser(req, res, next) {
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

    const emailToken = jwt.sign(
      { secret: user.email },
      process.env.SMTP_SECRET,
      {
        expiresIn: "1m",
      }
    );

    let token = await new Token({
      userId: user._id,
      token: emailToken,
      createdAt: Date.now(),
    }).save();

    const message = `Please click on the link below to verify your email\n${process.env.DOMAIN}/auth/verify/${user.id}/${token.token}`;
    await sendEmail(user.email, "Verify Email", message);
    res.send(
      "A link has been sent to your account, please click on that link to verify your email"
    );
  } catch (error) {
    next(error);
  }
}

module.exports = { createUser };
