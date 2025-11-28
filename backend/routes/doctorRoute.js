const express = require("express");
const router = express.Router();

const doctorsController = require("../controller/doctorsController");
const { authenticate } = require("../middleware/authenticate");
const { authorizePlatformRole } = require("../middleware/authorizePlatform");

router.get("/getdoctors", authenticate, doctorsController.GetDoctors);

module.exports = router;
