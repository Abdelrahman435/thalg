var express = require("express");
var router = express.Router();
const {
  signupController
} = require("../controller/signUpDriversController");
const {
  loginController,
  resendOTP,
  verifyUser,
} = require("../controller/loginDriversController");
const { resetPassOTP, changePass } = require("../controller/forgetDriverController");
const getDriversOrders = require("../controller/ordersController");
const Delevired = require("../controller/dashboardControllers");
const auth = require("../middlewares/protectDrivers");
const upload = require("../middlewares/uploadFiles");

router.post("/signup", signupController);
router.post("/resend-otp", resendOTP);
router.post("/verify", auth, verifyUser);
router.post("/login", loginController);
router.post("/resetPassOTP", resetPassOTP);
router.post("/resetPassVerify", changePass);
router.patch("/delevired/:orderId", auth, Delevired.Delevired);
router.get("/orders", auth, getDriversOrders.getDriversOrders);
router.post("/paySubscription", auth, upload.single("file"), Delevired.paySubscription);

module.exports = router;