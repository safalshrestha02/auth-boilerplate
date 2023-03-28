require("dotenv").config();

const allowedOrigins = [
<<<<<<< HEAD
  `http://localhost:/${process.env.PORT}`, // your localhost url
  "https://www.yourWebsite.com", // your domain url
  "https://www.google.com",
  "https://accounts.google.com/",
  "https://play.google.com/"
=======
  `http://localhost:${process.env.PORT}`, // your localhost url
  "https://www.yourWebsite.com", // your domain url
>>>>>>> 0a919f6 (feat: email verification)
];

module.exports = allowedOrigins;
