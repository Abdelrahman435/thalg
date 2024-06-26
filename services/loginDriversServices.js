const connection = require("../DB/dbConnection");
const util = require("util");

async function getUser(email, password) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const getUser = await query("select * from drivers where email = ?", [
      email,
    ]);
    if (getUser.length <= 0) {
      return {
        msg: "The email address or mobile number you entered isn't connected to an account.",
        status: 404,
      };
    }
    return getUser;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { getUser };
