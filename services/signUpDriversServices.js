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

module.exports = { getEmail, getId, insertUser };
