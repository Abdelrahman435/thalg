const connection = require("../DB/dbConnection");
const util = require("util");

exports.proofDocuments = async (data, id) => {
  const query = util.promisify(connection.query).bind(connection);
  return await query("UPDATE drivers SET? WHERE id = ?", [data, id]);
};

exports.getDriver = async (id) => {
  const query = util.promisify(connection.query).bind(connection);
  return await query("SELECT * FROM drivers WHERE id = ?", [id]);
};
