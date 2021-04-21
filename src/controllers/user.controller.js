/**
 * @module controller/user
 * @requires module:model/user
 * @requires module:model/test
 * @requires module:model/visit
 */

const User = require("../models/user.model");
const Test = require("../models/test.model");
const Visit = require("../models/visit.model");

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
exports.getUserByNic = (req, res) => {
  if (!req.profile)
    return res.status(400).json({
      result: null,
      success: false,
      msg: "Invalid request",
    });
  return res.status(200).json({
    result: req.profile,
    success: true,
    msg: "User fetch success",
  });
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
    const result = await User.find({ healthStatus: "positive" })
      .select("-salt -encry_password")
      .sort({ updatedAt: -1 });

    if (!result)
      return res.status(400).json({
        result: null,
        success: false,
        msg: "Covid positive users fetch failed",
      });
    return res.status(200).json({
      result,
      success: true,
      msg: "Covid positive users fetch success",
    });
  } catch (error) {
    return res.status(500).jason({
      result: error.message,
      success: false,
      msg: "Internal server error",
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
    if (!req.profile)
      return res.status(400).json({
        result: null,
        success: false,
        msg: "Invalid request",
      });

    const { testStatus, issuedBy, issuedDate, testedDate, testType } = req.body;
    const { _id: id } = req.profile;

    const result = await User.findByIdAndUpdate(
      id,
      {
        $set: { healthStatus: testStatus },
      },
      { new: true }
    );

    if (!result)
      return res.status(400).json({
        result: null,
        success: false,
        msg: "User health status update failed",
      });

    const test = new Test({
      owner: id,
      result: testStatus,
      issuedBy,
      issuedDate,
      testedDate,
      testType,
    });

    const testRes = await test.save();

    if (!testRes)
      return res.status(400).json({
        result: null,
        success: false,
        msg: "User test result update failed",
      });
    return res.status(200).json({
      result: { testId: testRes._id },
      success: true,
      msg: "User test result update success",
    });
  } catch (error) {
    return res.status(500).jason({
      result: error.message,
      success: false,
      msg: "Internal server error",
    });
  }
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
    if (!req.profile)
      return res.status(400).json({
        result: null,
        success: false,
        msg: "Invalid request",
      });

    const { _id: id } = req.profile;

    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(400).json({
        result: null,
        success: false,
        msg: "User deletion failed",
      });
    }

    const testResult = await Test.findOneAndDelete({ owner: id });
    if (!testResult) {
      return res.status(400).json({
        result: null,
        success: false,
        msg: "User tests deletion failed",
      });
    }

    const visitResult = await Visit.findOneAndDelete({ user: id });
    if (!visitResult) {
      return res.status(400).json({
        result: null,
        success: false,
        msg: "User visits deletion failed",
      });
    }

    return res.status(200).json({
      result: null,
      success: true,
      msg: "User deletion success",
    });
  } catch (error) {
    return res.status(500).jason({
      result: error.message,
      success: false,
      msg: "Internal server error",
    });
  }
};
