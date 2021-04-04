const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const visitSchema = new mongoose.Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    arrival: Date,
    departure: Date,
  },
  { timestamps: true }
);

const Visit = mongoose.model("Visit", visitSchema, "visits");

module.exports = Visit;
