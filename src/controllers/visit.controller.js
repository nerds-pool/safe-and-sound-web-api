/**
 * @module controller/visit
 * @requires module:model/visit
 * @requires module:model/user
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
  try {
  } catch (error) {}
};

/**
 * Fetch associates of positive user by user nic [CDC]
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @async
 * @returns {object} HTTP response
 */
exports.getVisitAssociatesByUserNic = async (req, res) => {
  try {
    // Extract user id
    const id = req.params.id;
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
        message: "Associates fetch failed",
      });

    return res
      .status(200)
      .json({ result, success: true, message: "Associates fetch succeeded" });
  } catch (error) {
    res.status(500).json({
      result: error.message,
      success: false,
      message: "Internal server error while fetching associates",
    });
  }
};
