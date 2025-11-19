const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();
const thirdPartyController = require("../controller/thirdPartyController");
const { Register } = require("../controller/registerControlller");
const path = require("path");

router.use("/img", express.static(path.join(__dirname, "img")));
router.post(
  "/convert",
  upload.single("image"),
  thirdPartyController.ConvertImg
);
router.post("/authface", thirdPartyController.AuthFace);
router.post("/auth", thirdPartyController.Auth);
<<<<<<< Updated upstream
=======
router.post("/measurements", thirdPartyController.Measurements);
>>>>>>> Stashed changes
router.post(
  "/register",
  upload.single("image"),
  Register
);


module.exports = router;
