/**
 * @module controller/visit
 * @requires module:model/visit
 * @requires module:model/user
 * @requires module:model/location
 */

const Visit = require("../models/visit.model");
const User = require("../models/user.model");
const Test = require("../models/test.model");
const Location = require("../models/location.model");

/**
 * Add a visited location [USER]
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @async
 * @returns {object} HTTP response
 */
exports.addVisitedLocation = async (req, res) => {
  const { user, location, arrival, departure } = req.body;

  try {
    const locationRes = await Location.findById(location);
    if (!locationRes)
      return res.status(422).json({
        result: null,
        success: false,
        msg: "Invalid location id",
      });

    const visit = new Visit({
      user,
      location,
      arrival,
      departure,
    });

    const result = await visit.save();
    if (!result)
      return res.status(400).json({
        result: null,
        success: false,
        msg: "Location update failed",
      });

    return res.status(200).json({
      result: result._id,
      success: true,
      msg: "Location update success",
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
 * Add a visited location [USER]
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @async
 * @returns {object} HTTP response
 */
exports.checkoutVisitedLocation = async (req, res) => {
  const { nic, visitId, departure } = req.body;

  try {
    const result = Visit.findByIdAndUpdate(
      visitId,
      {
        $set: { departure },
      },
      { new: true }
    );
    if (!result)
      return res.status(422).json({
        result: null,
        success: false,
        msg: "Invalid checkout data",
      });

    return res.status(200).json({
      result: result._id,
      success: true,
      msg: "Checkout success",
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
 * Fetch associates of positive user by user nic [CDC]
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @async
 * @returns {object} HTTP response
 */
exports.getVisitAssociatesByUserNic = async (req, res) => {
  if (!req.profile)
    return res.status(400).json({
      result: null,
      success: false,
      msg: "Invalid request",
    });
  try {
    // Extract user id
    const { id } = req.profile;
    let associates = [];
    let associateArray = [];

    // Get positive test result of the user by id
    const positiveTestsArray = await Test.find({
      owner: id,
      result: "positive",
    })
      .select("testedDate")
      .sort({
        testedDate: -1,
      })
      .limit(1);
    // Trace the latest result
    // Trace the test taken date
    const testTakenDate = positiveTestsArray[0].testedDate;
    // Fetch the locations user has visited on that date
    const locations = await Visit.find({
      user: id,
      createdAt: testTakenDate,
    });
    // Fetch visits which indicates same date and time period
    for (let location of locations) {
      const locationAssociateArray = await Visit.find({
        location: location._id,
        arrival: { $gte: location.arrival },
        departure: { $lte: location.departure },
      }).select("user");

      if (!locationAssociateArray) return;

      for (let locationAssociate of locationAssociateArray) {
        associateArray.push(locationAssociate);
      }
    }
    // Trace users
    for (let associate of associateArray) {
      associates.push(associate.user);
    }
    // Remove duplications
    const uniqueAssociates = new Set(...associates);
    // Fetch users => immediate associates
    const result = await User.find({ _id: { $in: uniqueAssociates } }).select(
      "-salt -encry_password"
    );

    if (!result)
      return res.status(422).json({
        result: null,
        success: false,
        message: "Trace Associates failed",
      });

    return res
      .status(200)
      .json({ result, success: true, message: "Trace Associates success" });
  } catch (error) {
    res.status(500).json({
      result: error.message,
      success: false,
      message: "Internal server error",
    });
  }
};
