/**
 * @module route/location
 * @requires module:controller/location
 */

const router = require("express").Router();
const location = require("../controllers/location.controller");

/**
 * Add new location [*external]
 * @name post/addLocation
 * @example {base-url}/location/new  
 * */
router.post("/new", location.addLocation);



module.exports = router;
