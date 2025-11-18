const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const thirdPartyController = require("../controller/thirdPartyController");

router.post(
  "/convert",
  upload.single("image"),
  thirdPartyController.ConvertImg
);
router.post("/authface", thirdPartyController.AuthFace);
router.post("/auth", thirdPartyController.Auth);
router.post("/measurements", thirdPartyController.Measurements);

module.exports = router;
