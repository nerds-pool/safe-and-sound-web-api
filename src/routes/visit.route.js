/**
 * @module route/visit
 * @requires module:controller/visit
 * @requires module:controller/auth
 */

const router = require("express").Router();
const visit = require("../controllers/visit.controller");
const { isSignedIn, isCDC } = require("../controllers/auth.controller");

/**
 * Extract user nic from the url
 * @name param/extractNic
 */
router.param("nic", visit.getUser);

/**
 * Fetch associates who has visited the positive user visited places [CDC]
 * @name get/fetchVisitAssociatesByUserNic
 * @example {base-url}/visit/19942356921?date="2021-04-01T17:28:41.034Z"&arr="2021-04-01T17:28:41.034Z"&dep="2021-04-01T17:58:09.032Z"
 */
router.get(
  "/:nic",
  visit.getUser,
  isSignedIn,
  isCDC,
  visit.getVisitAssociatesByUserNic
);
// isSignedIn, isCDC, <- put these middleware before controller

/**
 * Add a visited location [USER]
 * @name put/addVisitedLocation
 * @example endpoint => {base-url}/visit/add
 */
router.put("/add", isSignedIn, visit.addVisitedLocation);

/**
 * Add a visited location [USER]
 * @name put/checkoutVisitedLocation
 * @example endpoint => {base-url}/visit/checkout
 */
router.patch("/checkout", isSignedIn, visit.checkoutVisitedLocation);

module.exports = router;
