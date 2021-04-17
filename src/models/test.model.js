const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const testSchema = new mongoose.Schema(
  {
    owner: {
      type: ObjectId,
      ref: "User",
    },
    issuedBy: String,
    issuedDate: Date,
    testedDate: Date,
    testType: {
      type: String,
      enum: ["pcr", "antigen"],
      default: "pcr",
    },
    result: {
      type: String,
      enum: ["positive", "negetive"],
      default: "negetive",
    },
  },
  { timestamps: true }
);

const Test = mongoose.model("Test", testSchema, "tests");

module.exports = Test;
