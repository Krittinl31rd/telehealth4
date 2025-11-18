const express = require("express");
const router = express.Router();

const measurementsController = require("../controller/measurementsController");

router.post("/measurements", measurementsController.Measurements);

module.exports = router;
