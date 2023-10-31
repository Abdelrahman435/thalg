var express = require("express");
var router = express.Router();
const auth = require("../middlewares/protect");
const {
  signupController,
  resendOTP,
  verifyUser,
} = require("../controller/signupCustomerController");
const {loginController} = require("../controller/loginController")
const {
  resetPassOTP,
  changePass,
} = require("../controller/forgertController");

router.post("/signup", signupController);
router.post("/resend-otp", resendOTP);
router.post("/verify",auth, verifyUser);
router.post("/login", loginController);
router.post("/resetPassOTP", resetPassOTP);
router.post("/resetPassVerify", changePass);

module.exports = router;
