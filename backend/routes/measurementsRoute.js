const express = require("express");
const router = express.Router();

const measurementsController = require("../controller/measurementsController");
const { authenticate } = require("../middleware/authenticate");
const { authorizePlatformRole } = require("../middleware/authorizePlatform");

router.post("/measurements", measurementsController.Measurements);

router.get(
  "/measurements_types",
  authenticate,
  measurementsController.MeasurementsTypes
);

router.post(
  "/readmeasurements",
  authenticate,
  measurementsController.ReadMeasurementsByTypeAndID
);

module.exports = router;
