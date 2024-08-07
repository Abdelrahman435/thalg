const connection = require("../DB/dbConnection");
const util = require("util");

async function getEmail(email) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const getEmail = await query("select * from drivers where email = ?", [
      email,
    ]);
    return getEmail.length > 0;
  } catch (error) {
    console.log(error);
  }
}

async function insertUser(data) {
  try {
    query = util.promisify(connection.query).bind(connection);
    const user = await query("INSERT INTO drivers SET ?", [data]);
    if (!user) return { msg: "INTERNAL SERVER ERROR", status: 500 };
  } catch (error) {
    console.log(error);
  }
}

async function getId(email) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const id = await query("select id from drivers where email = ?", [email]);
    return id;
  } catch (error) {
    console.log(error);
  }
}

async function insertOTP(data) {
  try {
    query = util.promisify(connection.query).bind(connection);
    await query("INSERT INTO otp SET ?", [data]);
  } catch (error) {
    console.log(error);
  }
}

async function getOTP(id) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const idd = await query("select * from otp where id = ?", [id]);
    return idd;
  } catch (error) {
    console.log(error);
  }
}

async function verify(id) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const idd = await query("UPDATE drivers SET activate = ? where id = ?", [
      true,
      id,
    ]);
    return idd;
  } catch (error) {
    console.log(error);
  }
}

async function deleteOTP(id) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const idd = await query("DELETE from otp where id = ?", [id]);
    return idd;
  } catch (error) {
    console.log(error);
  }
}

async function getEmailInfo(email) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const getEmail = await query("select * from drivers where email = ?", [
      email,
    ]);
    return getEmail;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getEmail,
  getId,
  insertUser,
  insertOTP,
  getOTP,
  verify,
  deleteOTP,
  getEmailInfo,
};
