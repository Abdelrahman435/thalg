const fs = require("fs");
const userServices = require("../services/editProfileServices");
const bcrypt = require("bcrypt");
var passwordValidator = require("password-validator");
var schema = new passwordValidator();
const { getEmail } = require("../services/signUpDriversServices");

schema
  .is()
  .min(8)
  .is()
  .max(255)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces();

exports.editProfile = async (req, res) => {
  try {
    let result;
    let user = await userServices.getUser(req.user.id);
    if (!user[0]) {
      return res.status(404).json({ errors: ["User not found"] });
    }

    if (req.body.password) {
      const flag = await schema.validate(req.body.password);
      if (!flag) {
        return res.status(400).json({
          msg: "password should contain : 1 lowercase, 1 uppercase, 2 digits, no spaces, length of 8",
        });
      }
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    if (fs.existsSync("../upload" + user[0].image)) {
      fs.unlinkSync("../upload/" + user[0].image);
    }
    if (req.file) {
      req.body.image = req.file.filename;
    }

    result = await userServices.editProfile(req.body, req.user.id);

    if (result.length == 0) {
      return res.status(400).send("profile not updated");
    }
    return res.status(200).send("updated successfully");
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error updating profile" });
  }
};

exports.editProfileDriver = async (req, res) => {
  try {
    let result;
    let driver = await userServices.getDriver(req.user.id);
    if (!driver[0]) {
      return res.status(404).json({ errors: ["Driver not found"] });
    }
    if (req.body.email) {
      if (
        (await getEmail(req.body.email)) &&
        req.body.email != driver[0].email
      ) {
        return res.status(400).json({ msg: "email already registered" });
      }
    }
    if (req.body.password) {
      const flag = await schema.validate(req.body.password);
      if (!flag) {
        return res.status(400).json({
          msg: "password should contain : 1 lowercase, 1 uppercase, 2 digits, no spaces, length of 8",
        });
      }
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }
    result = await userServices.editProfileDriver(req.body, req.user.id);

    if (result.length == 0) {
      return res.status(400).send("profile not updated");
    }
    return res.status(200).send("updated successfully");
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "error updating profile" });
  }
};
