const connection = require("../DB/dbConnection");
const util = require("util");

exports.sendOffer = async (data) => {
  const query = util.promisify(connection.query).bind(connection);
  const offer = await query(
    "SELECT * FROM offers WHERE order_id =? AND user_id =?",
    [data.order_id, data.user_id]
  );
  if (offer.length > 0) {
    await query("UPDATE offers SET? WHERE order_id =? AND user_id =?", [
      data,
      data.order_id,
      data.user_id,
    ]);
    return "Your offer has been Updated";
  } else {
    await query("INSERT INTO offers SET?", [data]);
    return "Sent successfully";
  }
};
