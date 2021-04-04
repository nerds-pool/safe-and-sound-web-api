/**
 * @module route/auth
 * @requires module:controller/auth
 */

const router = require("express").Router();
const auth = require("../controllers/auth.controller");

/**
 * Sign up user to the api [USER]
 * @name post/signup
 * @example endpoint => {base-url}/auth/signup
 * @example body => {name: "Saman Kumara", nic: "19942356921", email: "samanku@gmail.com", password: "123456", dob: "1994-07-25T17:28:41.034Z", adddress: { line: "No 2, Paliwila, Dompe", city: "Dompe", postal: 11680}, profession: "Engineer"}
 */
router.post("/signup", auth.isNicExist, auth.signup);

/**
 * Sign in user to the api [USER]
 * @name post/signin
 * @example endpoint => {base-url}/auth/signin
 * @example body => {nic: "19942356921", password: "123456"}
 */
router.post("/signin", auth.signin);

module.exports = router;
