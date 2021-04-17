const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    address: {
      line: String,
      city: String,
      district: String,
    },
    contact: String,
    email: String,
  },
  { timestamps: true }
);

const Location = mongoose.model("Location", locationSchema, "locations");

module.exports = Location;
