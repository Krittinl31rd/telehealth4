const express = require("express");
const router = express.Router();

const roomsController = require("../controller/roomsController");
const { authenticate } = require("../middleware/authenticate");
const { authorizePlatformRole } = require("../middleware/authorizePlatform");

router.post("/create_room", authenticate, roomsController.CreateRoom);

module.exports = router;
