/**
 * @module controller/auth
 * @requires module:model/user
 * @requires module:helpers/JWTEngine
 * @library express-validator
 */

const User = require("../models/user.model");
const { validationResult } = require("express-validator");
const { signJWT } = require("../helpers/JWTEngine");
const expressJwt = require("express-jwt");
/**
 * Sign up user to api [USER]
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @async
 * @returns {object} HTTP response
 */
exports.signup = async (req, res) => {
  try {
    // const errors = validationResult(req);
    // console.log("Validation Errors", errors.array());

    // if (!errors.isEmpty()) {
    //   return res.status(422).json({
    //     result: errors.array()[0].msg,
    //     success: false,
    //     msg: "validation failed",
    //   });
    // }

    const user = new User(req.body);

    console.log("user", user);

    const result = await user.save();

    if (!result)
      return res.status(400).json({
        result: result,
        success: false,
        msg: "Sign up failed",
      });
    return res.status(200).json({
      result: result._id,
      success: true,
      msg: "Sign up success",
    });
  } catch (error) {
    return res.status(500).json({
      result: error.message,
      success: false,
      msg: "Internal server error",
    });
  }
};

/**
 * Sign in user to api [USER]
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @async
 * @returns {object} HTTP response
 */
exports.signin = async (req, res) => {
  try {
    const { nic, password } = req.body;
    const user = await User.findOne({ nic });

    console.log("user", user);
    console.log("user auth", user.authenticate(password.toString()));

    if (!user || !user.authenticate(password))
      return res.status(401).json({
        result: null,
        success: false,
        msg: "Invalid username or password",
      });

    const response = signJWT({
      id: user._id,
      nic: user.nic,
      role: user.role,
    });

    if (!response.success)
      return res.status(422).json({
        result: null,
        success: false,
        msg: "Error while creating the signed token",
      });

    const signToken = response.result;

    return res.status(200).json({
      result: {
        id: user._id,
        nic: user.nic,
        role: user.role,
        signToken,
      },
      success: true,
      msg: "Signin success",
    });
  } catch (error) {
    return res.status(500).json({
      result: error.message,
      success: false,
      msg: "Internal server error",
    });
  }
};

/**
 * Check if email already exist
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @param {function} next
 * @returns {object} HTTP response
 */
exports.isNicExist = (req, res, next) => {
  const { nic } = req.body;
  User.findOne({ nic })
    .then((user) => {
      if (user)
        return res.status(422).json({
          result: null,
          success: false,
          msg: "User with this NIC already exists",
        });
      next();
    })
    .catch((err) =>
      res.status(500).json({
        result: err.message,
        success: false,
        msg: "Internal server error",
        devmsg: "Internal server error @activateAccountController",
      })
    );
};

/**
 * Check whether user has a valid token
 * @property {string} secret secret for enc and dec
 * @property {object} userProperty save current user token data
 * @property {string[]} algorithms Used algo to enc and dec
 */
exports.isSignedIn = expressJwt({
  secret: process.env.SIGN_TOKEN_SECRET,
  userProperty: "auth",
  algorithms: ["sha1", "RS256", "HS256"],
});

/**
 * Check whether  user is PHI
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @param {function} next
 * @returns {object} HTTP response
 */
exports.isPHI = (req, res, next) => {
  const isPHI = req.auth.role === 49;
  if (!isPHI)
    return res.status(403).json({
      result: null,
      success: false,
      msg: "403! Forbidden",
    });
  next();
};

/**
 * Check whether  user is CDC
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @param {function} next
 * @returns {object} HTTP response
 */
exports.isCDC = (req, res, next) => {
  const isCDC = req.auth.role === 99;
  if (!isCDC)
    return res.status(403).json({
      result: null,
      success: false,
      msg: "403! Forbidden",
    });
  next();
};
