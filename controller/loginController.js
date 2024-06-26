const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUser, isVerified } = require("../services/loginServices");
const { getId } = require("../services/signupCustomerServices");
const path = require("path");

async function loginController(req, res, next) {
  try {
    const result = await getUser(req.body.email, req.body.password);
    if (!(await bcrypt.compare(req.body.password, result[0].password))) {
      return res.status(400).json({ msg: "password isn't correct" });
    }
    result[0].image =
      "http://mircle50-001-site1.atempurl.com/" + result[0].image;
    delete result[0].password;
    if (!result[0].verified) {
      return res
        .status(401)
        .json({ msg: "your account needs to be verified..." });
    }
    const id = await getId(req.body.email);
    const token = await jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    return res.status(200).json({ data: result, token });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      msg: "The email address or mobile number you entered isn't connected to an account.",
    });
  }
}

module.exports = { loginController };
