const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const visitSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
    },
    location: {
      type: Object,
      ref: "Location",
    },
    arrival: Date,
    departure: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const Visit = mongoose.model("Visit", visitSchema, "visits");

module.exports = Visit;
