const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { nanoid } = require("nanoid");
const {
  getEmail,
  insertUser,
  getId,
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
