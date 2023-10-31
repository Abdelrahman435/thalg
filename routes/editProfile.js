var express = require("express");
var router = express.Router();
const upload = require("../middlewares/uploadFiles");
const editProfile = require("../controller/editProfileController");
const auth = require("../middlewares/protect");
const auth2 = require("../middlewares/protectDrivers");

router.patch("/", auth, upload.single("image"), editProfile.editProfile);
router.patch("/driver", auth2, editProfile.editProfileDriver);

module.exports = router;
