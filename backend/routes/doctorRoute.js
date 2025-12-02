const express = require("express");
const router = express.Router();

const doctorsController = require("../controller/doctorsController");
const { authenticate } = require("../middleware/authenticate");
const { authorizePlatformRole } = require("../middleware/authorizePlatform");
const { user_role } = require("../constant/enum");

router.get("/getdoctors", authenticate, doctorsController.GetDoctors);
router.post(
  "/changestatus",
  authenticate,
  authorizePlatformRole(user_role.d),
  doctorsController.HandleStatus
);

module.exports = router;
