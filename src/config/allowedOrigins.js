require("dotenv").config();

const allowedOrigins = [
  `http://localhost:/${process.env.PORT}`, // your localhost url
  "https://www.yourWebsite.com", // your domain url
  "https://www.google.com",
  "https://accounts.google.com/",
  "https://play.google.com/"
];

module.exports = allowedOrigins;
