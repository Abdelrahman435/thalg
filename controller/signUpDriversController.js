const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { nanoid } = require("nanoid");
const {
  getEmail,
  insertUser,
  getId,
  insertOTP,
} = require("../services/signUpDriversServices");
require("dotenv").config();

async function signupController(req, res) {
  try {
    const nId = await nanoid(10);
    if (await getEmail(req.body.email)) {
      return res.status(400).json({ msg: "email already registered" });
    }
    const user = {
      id: nId,
      fullname: req.body.fullname,
      phone: req.body.phone,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
    };

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
    let otp = Math.floor(1000 + Math.random() * 9000);
    let message = {
      from: "Thalj",
      to: req.body.email,
      subject: "Verify",
      text: `otp is ${otp}`,
      html: `<p>otp is<br> <h1>${otp}</h1><br><h3>Your code will expire in 2 minutes</h3></p>`,
    };
    otp = bcrypt.hashSync(String(otp), 10);
    await transporter.sendMail(message).catch((error) => {
      return res.status(500).json({ msg: "INTERNAL SERVER ERROR" });
    });

    const d = new Date();
    d.setMinutes(d.getMinutes());
    const d2 = new Date();
    d2.setMinutes(d2.getMinutes() + 2);

    let obj2 = {
      otp: otp,
      createdAt: Number(d),
      expiresAt: Number(d2),
      id: nId,
    };
    await insertOTP(obj2);
    await insertUser(user);
    const id = await getId(user.email);
    const token = await jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
    });
    delete user.password;
    return res.status(201).json({ status: "OK", data: user, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "INTERNAL SERVER ERROR" });
  }
}

module.exports = { signupController };
