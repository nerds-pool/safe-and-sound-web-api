const express = require("express");
const cors = require("cors");
const rfs = require("rotating-file-stream");
const morgan = require("morgan");
const path = require("path");
const serverless = require("serverless-http");

require("dotenv").config({ path: "./config/.env" });
require("./db/connect");

// Init express app
const app = express();

// Morgan logger stream write -> access.log
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: path.join(__dirname, "log"),
});

// Middlewares
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const baseRoute = "/.netlify/functions/api";

/** Unauthorized error handler */
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res
      .status(401)
      .json({ result: null, success: false, msg: "Invalid API key" });
  }
});

/** Not Found error handler */
app.all("*", (req, res) => {
  res.status(404).json({
    result: "404",
    success: false,
    msg: "404! page not found",
  });
});

// Server instance
const PORT = process.env.PORT ?? 8000;
app.listen(PORT, () =>
  console.log(
    `⚡ [server] Server is running on ${PORT} in ${process.env.NODE_ENV} mode`
  )
);

module.exports.handler = serverless(app);
