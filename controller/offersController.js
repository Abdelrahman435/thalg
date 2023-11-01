const offersService = require("../services/offersServices");
const { nanoid } = require("nanoid");

exports.sendOffer = async (req, res) => {
  try {
    const nId = await nanoid(10);
    const data = {
      id: nId,
      fullName: req.body.fullName,
      price: req.body.price,
      phoneNumber: req.body.phoneNumber,
      order_id: req.params.orderId,
      user_id: req.user.id,
    };
    const offers = await offersService.sendOffer(data);
    if (offers == "Sent successfully") {
      return res.status(200).json({ msg: "success" });
    } else {
      return res.status(200).json({ msg: "Offer Updated" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

exports.reviewOffers = async (req, res) => {
  try {
  } catch (error) {}
};
