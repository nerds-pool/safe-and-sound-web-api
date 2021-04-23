const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");

require("dotenv").config({ path: "./config/.env" });
require("./db/connect");

// Init express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const baseRoute = "/.netlify/functions/api";
const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const visitRoute = require("./routes/visit.route");
const locationRoute = require("./routes/location.route");

app.use(`${baseRoute}/auth`, authRoute);
app.use(`${baseRoute}/user`, userRoute);
app.use(`${baseRoute}/visit`, visitRoute);
app.use(`${baseRoute}/location`, locationRoute);

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

module.exports.handler = serverless(app);
