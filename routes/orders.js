var express = require("express");
var router = express.Router();
const orders = require("../controller/ordersController");
const auth1 = require("../middlewares/protect");
const auth2 = require("../middlewares/protectDrivers");
const upload = require("../middlewares/uploadFiles");

router
  .route("/")
  .post(auth1, upload.single("image"), orders.orderDetails)
  .get(auth2, orders.getOrders);

router.get("/myOrders", auth1, orders.getMyOrders);

router.get("/:id", auth2, orders.getOrder);

router.get("/getOrder/:id", auth1, orders.getOneOrder);

router.delete("/:id", auth1, orders.deleteOrder);

module.exports = router;
