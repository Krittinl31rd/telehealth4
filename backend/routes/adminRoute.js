const express = require("express");
const router = express.Router();
const enums =  require("../constant/enum")
const usermanageController = require("../controller/usermanageController");
const { authenticate } = require("../middleware/authenticate");
const { authorizePlatformRole } = require("../middleware/authorizePlatform");

router.get("/getallusers", authenticate, authorizePlatformRole(enums.user_role.a), usermanageController.GetAllUsers);

module.exports = router;
