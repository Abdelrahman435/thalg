const connection = require("../DB/dbConnection");
const util = require("util");

exports.editProfile = async (data, id) => {
  const query = util.promisify(connection.query).bind(connection);
  return await query("UPDATE users SET? WHERE id = ?", [data, id]);
};

exports.getUser = async (id) => {
  const query = util.promisify(connection.query).bind(connection);
  return await query("SELECT * FROM users WHERE id = ?", [id]);
};


exports.editProfileDriver = async (data, id) => {
  const query = util.promisify(connection.query).bind(connection);
  return await query("UPDATE drivers SET? WHERE id = ?", [data, id]);
};

exports.getDriver = async (id) => {
  const query = util.promisify(connection.query).bind(connection);
  return await query("SELECT * FROM drivers WHERE id = ?", [id]);
};