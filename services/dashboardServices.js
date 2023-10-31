const connection = require("../DB/dbConnection");
const util = require("util");

exports.dashboard = async() => {
    const query = util.promisify(connection.query).bind(connection);
    return await query("SELECT * FROM drivers WHERE verified = '0'")
}

exports.Acceptance = async(id) => {
    const query = util.promisify(connection.query).bind(connection);
    return await query("UPDATE drivers SET verified = '1' WHERE id = ?",[id])
}

exports.refused = async(id) => {
    const query = util.promisify(connection.query).bind(connection);
    return await query("DELETE FROM drivers WHERE id =?",[id])
}