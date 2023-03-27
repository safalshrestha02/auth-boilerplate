const { logEvents } = require("./logger");

// custom error handler logger for the app
const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}\t${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errorLog.log"
  );
  console.log(err.stack);

  const status = req.statusCode ? res.statusCode : 500; //server error
  res.status(status);
  res.json({ message: err.message });
};

module.exports = errorHandler;
