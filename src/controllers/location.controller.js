/**
 * @module controller/location
 * @requires module:model/location
 */

const Location = require("../models/location.model");

/**
 * Add a visited location [USER]
 * @param {object} req HTTP request
 * @param {object} res HTTP response
 * @async
 * @returns {object} HTTP response
 */
exports.addLocation = async (req, res) => {
  try {
    const { name, address, contact, email } = req.body;
    const location = new Location({
      name,
      address,
      contact,
      email,
    });
    const result = await location.save();
    if (!result) {
      return res
        .status(400)
        .json({ result: null, success: false, msg: "Failed to save location" });
    }
    return res
      .status(200)
      .json({ result, success: true, msg: "Location saved" });
  } catch (error) {
    return res.status(500).json({
      result: error.message,
      success: false,
      msg: "Internal server error",
    });
  }
};
