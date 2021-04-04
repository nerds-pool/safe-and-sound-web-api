/**
 * @module helpers/JWTEngine
 */
const jwt = require("jsonwebtoken");

/**
 * @description sign and encode a JWT token with expiration time of 5m
 * @param {object} payload
 * @returns {string} JWT token
 */
exports.signJWT = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.SIGN_TOKEN_SECRET, {
      expiresIn: "5m",
      issuer: "tell.com",
    });
    if (!token)
      throw new Error("Something went wrong inside JWT engine when sign");
    return { result: token, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};

/**
 * @description verify and decode a JWT token
 * @param {string} token JWT token to decode
 * @returns {object} decoded JWT token
 */
exports.verifyJWT = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.SIGN_TOKEN_SECRET);
    if (!decodedToken)
      throw new Error("Something went wrong inside JWT engine when verify");
    return { result: decodedToken, success: true };
  } catch (error) {
    return { result: error.message, success: false };
  }
};
