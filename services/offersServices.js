const connection = require("../DB/dbConnection");
const util = require("util");

exports.sendOffer = async (data) => {
  const query = util.promisify(connection.query).bind(connection);
const offer = await query("SELECT * FROM offers WHERE order_id =? AND user_id =?",[data.order_id,data.user_id])
if(offer.length > 0) {
    return "You already sent a offer to this order"
}
else{
 await query("INSERT INTO offers SET?", [data]);
return "Sent successfully"
}
};
