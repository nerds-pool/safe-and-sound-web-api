const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    nic: {
      type: String,
      unique: true,
      require: true,
    },
    email: {
      type: String,
      unique: true,
    },
    encry_password: {
      type: String,
      require: true,
    },
    dob: {
      type: Date,
      require: true,
    },
    address: {
      line: String,
      city: String,
      postal: String,
    },
    profession: {
      type: String,
    },
    affiliation: {
      type: String,
    },
    healthStatus: {
      type: String,
      enum: ["positive", "negetive", "deceased", "recovered"],
      default: "negetive",
    },
    role: {
      type: Number,
      enum: [0, 49, 99],
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
