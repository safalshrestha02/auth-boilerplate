const User = require("../models/User");

async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({ success: true, user: user });
    }
  } catch (error) {
    next(error);
  }
}

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
    } else {
      res.json({ user: user });
    }
  } catch (error) {
    next(error);
  }
}

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
module.exports = { registerUser, getAllUser, loginUser, apiPage };
