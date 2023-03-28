const axios = require("axios");
require("dotenv").config();
const User = require("../models/User");

async function getGoogleOAuth(code) {
  try {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
      code,
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      redirect_uri: process.env.OAUTH_REDIRECT,
      grant_type: "authorization_code",
    };

    const res = await axios.post(url, values, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (res.status === 200) {
      const data = res.data;
      return data;
    }

    return res;
  } catch (error) {
    console.error(error.message);
  }
}

async function getGoogleUser(id_token, access_token) {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw new Error(error);
  }
}

async function findAndUpdateUser(query, update, options) {
  return User.findOneAndUpdate(query, update, options);
}

module.exports = { getGoogleOAuth, getGoogleUser, findAndUpdateUser };
