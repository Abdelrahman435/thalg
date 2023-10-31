const fs = require("fs");
const { sendInvoice } = require("../services/invoiceServices");
const { nanoid } = require("nanoid");
const getInvoices = require("../services/invoiceServices");

async function payment(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        errors: [{ msg: "Files is Required" }],
      });
    }
    const nId = await nanoid(10);
    let data = {
      file: req.file.filename,
      userId: req.user.id,
      orderId: req.body.orderId,
      userName: req.user.name,
      id: nId,
      driverId: req.body.driverId,
    };
    await sendInvoice(data);
    return res.status(200).json({ msg: "invoice sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "INTERNAL SERVER ERROR" });
  }
}

module.exports = { payment };
