var express = require("express");
var router = express.Router();
const offers = require("../controller/offersController");
const auth = require("../middlewares/protectDrivers");

router.use(auth);

router.route("/:orderId").post(offers.sendOffer);

module.exports = router;
