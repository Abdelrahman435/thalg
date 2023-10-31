var express = require("express");
var router = express.Router();
const { signupController } = require("../controller/signUpDriversController");
const { loginController } = require("../controller/loginDriversController");
const getDriversOrders = require("../controller/ordersController");
const Delevired = require("../controller/dashboardControllers");
const auth = require("../middlewares/protectDrivers");
const upload = require("../middlewares/uploadFiles");

router.post("/signup", signupController);
router.post("/login", loginController);
router.patch("/delevired/:orderId", auth, Delevired.Delevired);
router.get("/orders", auth, getDriversOrders.getDriversOrders);
router.post("/paySubscription", auth, upload.single("file"), Delevired.paySubscription);

module.exports = router;