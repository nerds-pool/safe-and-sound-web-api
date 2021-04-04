/**
 * @module route/visit
 * @requires module:controller/visit
 * @requires module:controller/auth
 */

const router = require("express").Router();
const visit = require("../controllers/visit.controller");
const { isSignedIn, isCDC } = require("../controllers/auth.controller");

/**
 * Fetch associates who has visited the positive user visited places [CDC]
 * @name get/fetchVisitAssociatesByUserNic
 * @example {base-url}/visit?nic=19942356921&date="2021-04-01T17:28:41.034Z"&arr="2021-04-01T17:28:41.034Z"&dep="2021-04-01T17:58:09.032Z"
 */
router.get("/", isSignedIn, isCDC, visit.getVisitAssociatesByUserNic);

/**
 * Add a visited location [USER]
 * @name put/addVisitedLocation
 * @example endpoint => {base-url}/visit/add
 * @example body => {nic: "19942356921", location: {lat: 6.9375, long: 6.9375}, arrival: "2021-04-01T17:28:41.034Z", departure: "2021-04-01T17:58:09.032Z"}
 */
router.post("/add", isSignedIn, visit.addVisitedLocation);

module.exports = router;
