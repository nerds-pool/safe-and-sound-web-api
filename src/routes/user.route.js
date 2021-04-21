/**
 * @module route/user
 * @requires module:controller/user
 * @requires module:controller/auth
 */

const router = require("express").Router();
const user = require("../controllers/user.controller");
const { isSignedIn, isPHI, isCDC } = require("../controllers/auth.controller");

/**
 * Extract user nic from the url
 * @name param/extractNic
 */
router.param("nic", isSignedIn, user.getUser);

/**
 * Fetch user by nic [CDC|PHI]
 * @name get/fetchUserByNic
 * @example {base-url}/user/fetch/19942356921
 */
router.get("/fetch/:nic", user.getUser, isSignedIn, user.getUserByNic);

/**
 * Fetch covid positive users [CDC]
 * @name get/covidPositiveUsers
 * @example {base-url}/user/covid-positive
 */
router.get("/covid-positive", isSignedIn, isCDC, user.getCovidPositiveUsers);

/**
 * Update user health status by nic [PHI]
 * @name put/updateHealthStatusByNic
 * @example {base-url}/user/health-status/19942356921?q=recoverd
 */
router.put(
  "/health-status/:nic",
  user.getUser,
  isSignedIn,
  isPHI,
  user.updateUserHealthStatus
);

/**
 * Delete user by nic [CDC]
 * @name delete/user
 * @example {base-url}/user/delete/19942356921
 */
router.delete(
  "/delete/:nic",
  user.getUser,
  isSignedIn,
  isCDC,
  user.deleteUserByNic
);

module.exports = router;
