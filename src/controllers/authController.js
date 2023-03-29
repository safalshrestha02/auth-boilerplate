const User = require("../models/User");
const Token = require("../models/Token");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/sendMail");
require("dotenv").config;
const {
  getGoogleOAuth,
  getGoogleUser,
  findAndUpdateUser,
} = require("../services/googleService");
//Will contain all the authentication controllers like login, getActive user & logout

//cookie options
const accessOptions = {
  expiresIn: "15m",
  httpOnly: true,
  domain: "localhost",
  path: "/",
  secure: "false",
  sameSite: "strict",
};
const refreshOptions = {
  expiresIn: "30d",
  httpOnly: true,
  domain: "localhost",
  path: "/",
  secure: "false",
  sameSite: "strict",
};

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

    // Check if the email is verified or not and check if the password matches
    if (user.isVerified === false) {
      res.json("please verify yopur email first");
    } else {
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        res.status(401).json({ error: "invalid credentials" });
      }
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
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      //secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    // Send accessToken containing username and roles
    res.json({ accessToken, user });
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

// @desc Verify Email
// @route POST /api/v1/auth/verify/:id/:token
// @access Public

async function verifyEmail(req, res, next) {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send("Invalid link");

    await User.updateOne({ _id: user._id, isVerified: true });
    await Token.findByIdAndRemove(token._id);

    res.send("email verified sucessfully");
  } catch (error) {
    next(error);
  }
}

// @desc Resend Verification Email
// @route POST /api/v1/auth/resendVerificationEmail
// @access Public

async function resendVerificationEmail(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(400).send("User doesnot exists");
    }

    if (user.isVerified === true) {
      res.status(400).send("User already exists");
    } else {
      const emailToken = jwt.sign(
        { secret: user.email },
        process.env.SMTP_SECRET,
        { expiresIn: "1m" }
      );

      let token = await new Token({
        userId: user._id,
        token: emailToken,
      }).save();

      const message = `Please click on the link below to verify your email\n${process.env.DOMAIN}/auth/verify/${user.id}/${token.token}`;
      await sendEmail(user.email, "Verify Email", message);
      res.send(
        "A link has been sent to your account, please click on that link to verify your email"
      );
    }
  } catch (error) {
    next(error);
  }
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

async function googleOauthRedirect(req, res, next) {
  try {
    //this is redirection from the google
    //we need to get code (id and access token) from the query on our redirect URI
    const code = req.query.code;
    //get user with token
    const googleAuthData = await getGoogleOAuth(code);

    const { id_token, access_token } = googleAuthData;

    const googleUser = await getGoogleUser(id_token, access_token);

    const email = googleUser.email;
    if (!googleUser.verified_email) {
      return res.status(403).send("google account is not verified");
    }
    const findEmail = await User.findOne({ email });
    //upsert user
    if (!findEmail) {
      await User.create({
        email,
        name: googleUser.name,
        picture: googleUser.picture,
        role: "User",
      });
    }
    //create session
    const user = await User.findOneAndUpdate(
      {
        email,
      },
      { email, name: googleUser.name, picture: googleUser.picture },
      { upsert: true, new: true }
    );
    const id = user._id;

    //create tokens
    const accessToken = jwt.sign(
      { UserInfo: { id, role: user.role } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { email: id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    //set cookie for the user
    res
      .cookie(
        "accessToken",
        accessToken,
        accessOptions && "refreshToken",
        refreshToken,
        refreshOptions
      )
      .redirect("/");
  } catch (error) {
    next(error);
  }
}

// @desc Get Active User
// @route POST /api/v1/auth/activeUser
// @access Private

async function activeUser(req, res, next) {
  try {
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
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.json({ message: "Cookie cleared" });
}

module.exports = {
  getAllUser,
  loginUser,
  refresh,
  verifyEmail,
  resendVerificationEmail,
  googleOauthRedirect,
  activeUser,
  logout,
};
