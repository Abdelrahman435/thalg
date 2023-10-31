var express = require("express");
var router = express.Router();
const dashboard = require("../controller/dashboardControllers");

const auth = require("../middlewares/protect");

router.use(auth);

router.get("/", dashboard.dashboard);
router.patch("/:id", dashboard.Acceptance);
router.delete("/:id", dashboard.rejected);
router.post("/renewDriver/:invoiceId", dashboard.renewSubscription);
router.get("/invoices", dashboard.getSubInvoices);

module.exports = router;
