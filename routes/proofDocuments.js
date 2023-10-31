var express = require("express");
var router = express.Router();
const upload = require("../middlewares/uploadFiles");
const proofDocuments = require("../controller/proofDocumentsController");
const auth = require("../middlewares/protectDrivers");

router.use(auth);

router.patch(
  "/",
  upload.fields([
    { name: "proofOfIdentityFront", maxCount: 1 },
    { name: "proofOfIdentityBack", maxCount: 1 },
    { name: "residenceCardFront", maxCount: 1 },
    { name: "residenceCardBack", maxCount: 1 },
    { name: "drivingLicense", maxCount: 1 },
    { name: "vehicleLicense", maxCount: 1 },
    { name: "operatingCard", maxCount: 1 },
    { name: "transferDocument", maxCount: 1 },
    { name: "commercialRegister", maxCount: 1 },
  ]),
  proofDocuments.proofDocuments
);

module.exports = router;
