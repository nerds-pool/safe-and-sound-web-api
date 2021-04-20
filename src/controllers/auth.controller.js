/**
 * @module controller/auth
 * @requires module:model/user
 * @library express-validator
 */

const expressJwt = require("express-jwt");
const User = require("../models/user.model");
const {body, validationResult} = require('express-validator')
/**
 * Sign up user to api [USER]
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @async
 * @returns {object} HTTP response
 */
 exports.signup = async (req, res) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()});
  }
  const {name, nic, dob, email, password,profession, affliation, healthStatus} = req.body;

  const user = new User({
    name: name,
    nic : nic,
    dob : dob,
    email : email,
    password: password,
    profession: profession,
    affliation: affliation,
    healthStatus: healthStatus
  });

  user.save((err,user)=>{
    if(err){
      res.status(400).json({
        err: 'User cannot be created'
      })
    }
    else{
      res.json(user)
    }
  });
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
  } catch (error) {}
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
        result: err,
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
