const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const compress = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("../routes/v1");
const { logger } = require("../middlewares/logger");
const errorHandler = require("../middlewares/errorHandler");
const corsOption = require("./corsOption");

const app = express();
const PORT = process.env.PORT;

// parse body params and attach them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
// parses cookies
app.use(cookieParser());
//checks if compression is needed in response bodies
app.use(compress());

// secure apps by setting various HTTP headers
app.use(helmet());

app.use(logger);

// enable CORS - Cross Origin Resource Sharing
app.use(cors(corsOption));

// mounting all available api based on version
app.use("/api", routes);

//google connect
const googleConnect = require("../utils/loginWithGoogle.js");

app.get("/", (req, res) =>
  res.send(
    `connected to server</p><button><a href = ${googleConnect()}>Login with google</a></button>`
  )
);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running at ${PORT}`));

module.exports = app;
