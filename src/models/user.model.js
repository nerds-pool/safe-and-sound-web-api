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

// Schema virluals for salt gen
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1(); // uuid for salt (using timestamps in v1)
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

// Schema methods
userSchema.methods = {
  // Schema method to encrypt the password
  securePassword: function (plainPass) {
    if (!plainPass) return "";

    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPass)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  authenticate: function (plainPass) {
    return this.securePassword(plainPass) === this.encry_password;
  },
};

const User = mongoose.model("User", userSchema, "users");

module.exports = User;