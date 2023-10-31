const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getUser } = require("../services/loginDriversServices");
const { getId } = require("../services/signUpDriversServices");

async function loginController(req, res, next) {
  try {
    const result = await getUser(req.body.email, req.body.password);
    if (!(await bcrypt.compare(req.body.password, result[0].password))) {
      return res.status(400).json({ msg: "password isn't correct" });
    }
    result[0].proofOfIdentityFront =
      "https://mircle50-001-site1.atempurl.com/" +
      result[0].proofOfIdentityFront;
    result[0].proofOfIdentityBack =
      "https://mircle50-001-site1.atempurl.com/" +
      result[0].proofOfIdentityBack;
    result[0].drivingLicense =
      "https://mircle50-001-site1.atempurl.com/" + result[0].drivingLicense;
    result[0].vehicleLicense =
      "https://mircle50-001-site1.atempurl.com/" + result[0].vehicleLicense;
    result[0].operatingCard =
      "https://mircle50-001-site1.atempurl.com/" + result[0].operatingCard;
    result[0].transferDocument =
      "https://mircle50-001-site1.atempurl.com/" + result[0].transferDocument;
    result[0].commercialRegister =
      "https://mircle50-001-site1.atempurl.com/" + result[0].commercialRegister;
    delete result[0].password;
    const id = await getId(req.body.email);
    const token = await jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    return res.status(200).json({ data: result, token });
  } catch (error) {
    return res.status(400).json({
      msg: "The email address or mobile number you entered isn't connected to an account.",
    });
  }
}

module.exports = { loginController };
