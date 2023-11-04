const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { getUser } = require("../services/loginDriversServices");
const {
  getEmail,
  getId,
  insertUser,
  insertOTP,
  getOTP,
  verify,
  deleteOTP,
  getEmailInfo,
} = require("../services/signUpDriversServices");

async function loginController(req, res, next) {
  try {
    const result = await getUser(req.body.email, req.body.password);
    if (!(await bcrypt.compare(req.body.password, result[0].password))) {
      return res.status(400).json({ msg: "password isn't correct" });
    }
    if (!result[0].activate) {
      return res
        .status(401)
        .json({ msg: "your account needs to be verified..." });
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
    let daysUntilExpiry;
    if (result[0].subscription_date == null) {
      daysUntilExpiry = null;
    } else {
      const currentDate = new Date();
      const subscriptionDate = new Date(result[0].subscription_date);
      const subscriptionExpiryDate = new Date(subscriptionDate);
      subscriptionExpiryDate.setMonth(subscriptionExpiryDate.getMonth() + 1);
      daysUntilExpiry = Math.floor(
        (subscriptionExpiryDate - currentDate) / (1000 * 60 * 60 * 24)
      );
    }

    return res.status(200).json({ data: result, token, daysUntilExpiry });
  } catch (error) {
    return res.status(400).json({
      msg: "The email address or mobile number you entered isn't connected to an account.",
    });
  }
}

async function resendOTP(req, res) {
  const user = await getEmailInfo(req.body.email);
  if (user == "") {
    return res.status(404).json({ msg: "user not found..." });
  }
  if (user[0].verified == true) {
    return res.status(400).json({ msg: "user already verified" });
  }
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    service: "Gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  let otp = await Math.floor(1000 + Math.random() * 9000);
  let message = {
    from: "Thalj",
    to: req.body.email,
    subject: "Verify",
    text: `Your OTP is ${otp}`,
    html: `<p>otp is<br> <h1>${otp}</h1><br><h3>Your code will expire in 2 minutes</h3></p>`,
  };
  otp = bcrypt.hashSync(String(otp), 10);
  await transporter.sendMail(message).catch((error) => {
    console.log(error);
  });

  const d = new Date();
  d.setMinutes(d.getMinutes());
  const d2 = new Date();
  d2.setMinutes(d2.getMinutes() + 2);

  let obj2 = {
    otp: otp,
    createdAt: Number(d),
    expiresAt: Number(d2),
    id: user[0].id,
  };
  await deleteOTP(user[0].id);
  await insertOTP(obj2);
  res.status(201).json({ msg: "OTP sent..." });
}

async function verifyUser(req, res) {
  if (!(await getEmail(req.body.email))) {
    return res.status(404).json({ msg: "User not found..." });
  }
  const user = await getEmailInfo(req.body.email);
  const otp = await getOTP(user[0].id);
  let d = new Date();
  if (otp == "") {
    return res.status(404).json({ msg: "No OTP was sent..." });
  }
  // console.log(otp[0].otp);
  if (!(await bcrypt.compare(req.body.otp, otp[0].otp))) {
    return res.status(401).json({ msg: "Authentication failed..." });
  }
  if (!(Number(d) < Number(otp[0].expiresAt))) {
    return res
      .status(400)
      .json({ msg: "OTP has expired, please try again..." });
  }
  const state = await verify(user[0].id);
  if (!state) {
    return res.status(500).json({ msg: "INTERNAL SERVER ERROR" });
  }
  await deleteOTP(user[0].id);
  return res.status(200).json({ msg: "Verified Successfully" });
}

module.exports = { loginController, resendOTP, verifyUser };
