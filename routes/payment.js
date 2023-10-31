var express = require("express");
var router = express.Router();
const { payment } = require("../controller/paymobController");
const getInvoicesController = require("../controller/dashboardControllers");
const auth = require("../middlewares/protect");
const upload = require("../middlewares/uploadFiles");

router.post("/pay", auth, upload.single("file"), payment);
router.get("/invoices", auth, getInvoicesController.getInvoicesController);
router.post("/accept/:invoiceId/:orderId",auth, getInvoicesController.acceptInvoice);
// router.patch("/refuse", )

module.exports = router;
