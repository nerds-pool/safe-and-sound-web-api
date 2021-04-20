/**
 * @module controller/user
 * @requires module:model/user
 */

const User = require("../models/user.model");

/**
 * Extract user nic from the url
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @param {function} next
 * @param {string} nic Url encoded user nic
 * @returns {object} HTTP response
 */
exports.getUser = (req, res, next, nic) => {
  User.findOne({ nic })
    .select("-salt -encry_password")
    .then((user) => {
      req.profile = user;
      next();
    })
    .catch((err) => {
      res.status(422).json({
        msg: "NO USER WAS FOUND",
        err: err,
      });
    });
};

/**
 * Fetch a user by nic [CDC|PHI]
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @asyn
 * @returns {object} HTTP response
 */
exports.getUserByNic = async (req, res) => {
  try {
    const { result, success } = await getUser(
      req.params.nic
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Error on my end with request",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "OK",
    });

  } catch (error) {
    return res.status(500).jason({
      msg:"Internal server error on getSerbyId",
      err:error.message,
      success:false,
    });
  }
};

/**
 * Fetch COVID positive users [CDC]
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @async
 * @returns {object} HTTP response
 */
exports.getCovidPositiveUsers = async (req, res) => {
  try {
    const { result, success } = await User(
      
    );
    if (!success) {
      return res.status(400).json({
        result,
        success,
        msg: "Error on my end with request",
      });
    }
    return res.status(200).json({
      result,
      success,
      msg: "OK",
    });

  } catch (error) {
    return res.status(500).jason({
      msg:"Internal server error on getSerbyId",
      err:error.message,
      success:false,
    });
  }
};

/**
 * Update health status of a user by nic [PHI]
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @async
 * @returns {object} HTTP response
 */
exports.updateUserHealthStatus = async (req, res) => {
  try {
  } catch (error) {}
};

/**
 * Delete user by nic [CDC]
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @async
 * @returns {object} HTTP response
 */
exports.deleteUserByNic = async (req, res) => {
  try {
  } catch (error) {}
};

