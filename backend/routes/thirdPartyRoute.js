const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer();
const thirdPartyController = require("../controller/thirdPartyController");
const {
  Register,
  Login,
  AuthMe,
  UpdateProfile,
  DeleteUser
} = require("../controller/registerControlller");
const path = require("path");
const { authenticate } = require("../middleware/authenticate");

router.use("/img", express.static(path.join(__dirname, "img")));
router.post(
  "/convert",
  upload.single("image"),
  thirdPartyController.ConvertImg
);
router.post("/authface", thirdPartyController.AuthFace);
router.post("/auth", thirdPartyController.Auth);

router.post("/login", Login);
router.get("/authme", authenticate, AuthMe);
router.post(
  "/updateprofile",
  authenticate,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  UpdateProfile
);
router.post("/register", upload.single("image"), Register);
router.post("/deleteuser", DeleteUser);
module.exports = router;
