const dashboardServices = require("../services/dashboardServices");
const {
  getInvoices,
  acceptInvoice,
  delevired,
  driverSubscription,
  renewSub,
  renewSubInvoices,
} = require("../services/invoiceServices");
const getDriver = require("../services/proofDocumentsServices");
const fs = require("fs");
const { nanoid } = require("nanoid");
exports.dashboard = async (req, res) => {
  try {
    const dashboard = await dashboardServices.dashboard();
    if (dashboard.length > 0) {
      dashboard.forEach((doc) => {
        doc.proofOfIdentityFront =
          "https://mircle50-001-site1.atempurl.com/" + doc.proofOfIdentityFront;
        doc.proofOfIdentityBack =
          "https://mircle50-001-site1.atempurl.com/" + doc.proofOfIdentityBack;
        doc.drivingLicense =
          "https://mircle50-001-site1.atempurl.com/" + doc.drivingLicense;
        doc.vehicleLicense =
          "https://mircle50-001-site1.atempurl.com/" + doc.vehicleLicense;
        doc.operatingCard =
          "https://mircle50-001-site1.atempurl.com/" + doc.operatingCard;
        doc.transferDocument =
          "https://mircle50-001-site1.atempurl.com/" + doc.transferDocument;
        doc.commercialRegister =
          "https://mircle50-001-site1.atempurl.com/" + doc.commercialRegister;
        delete doc.password;
      });
      return res.status(200).json(dashboard);
    } else {
      res.status(404).json({ errors: ["not found"] });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.getInvoicesController = async (req, res) => {
  try {
    const invoices = await getInvoices();
    if (!invoices)
      return res.status(404).json({ errors: ["no invoices found"] });
    invoices.map((invoice) => {
      invoice.image = "https://mircle50-001-site1.atempurl.com/" + invoice.file;
    });
    return res.status(200).json({ data: invoices });
  } catch (error) {
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.acceptInvoice = async (req, res) => {
  try {
    const accept = await acceptInvoice(
      req.params.invoiceId,
      req.params.orderId
    );
    if (accept.length > 0) {
      fs.unlinkSync("./upload/" + accept[0].file);
      res.status(200).json({ msg: "Invoice accepted" });
    } else {
      res.status(403).json({ msg: "Invoice not accepted" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.Delevired = async (req, res) => {
  try {
    await delevired(req.params.orderId);
    return res.status(200).json({ msg: "order delevired" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.Acceptance = async (req, res) => {
  try {
    const dashboard = await dashboardServices.Acceptance(req.params.id);
    if (dashboard) {
      res.status(200).json({ msg: "It has been Accepted" });
    } else {
      res.status(404).json({ errors: ["Not Accepted"] });
    }
  } catch (error) {
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.rejected = async (req, res) => {
  try {
    const driver = await getDriver.getDriver(req.params.id);
    if (driver.length > 0) {
      const filesToDelete = [
        driver[0].proofOfIdentityFront,
        driver[0].proofOfIdentityBack,
        driver[0].drivingLicense,
        driver[0].vehicleLicense,
        driver[0].operatingCard,
        driver[0].transferDocument,
        driver[0].commercialRegister,
      ];

      filesToDelete.forEach((file) => {
        const filePath = "../upload/" + file;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }
    const refused = await dashboardServices.refused(req.params.id);
    if (refused) {
      return res.status(200).json({ msg: "Refused" });
    } else {
      return res.status(404).json({ errors: ["Not found"] });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.paySubscription = async (req, res) => {
  try {
    const nId = await nanoid(10);
    if (!req.file) {
      return res.status(400).json({ errors: "invoice is required" });
    }
    const obj = {
      id: nId,
      driverId: req.user.id,
      invoice: req.file.filename,
    };
    const pay = await driverSubscription(obj);
    if (pay) {
      return res.status(200).json({ msg: "Subscription paid" });
    } else {
      return res.status(404).json({ errors: ["Not found"] });
    }
  } catch (error) {
    return res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.renewSubscription = async (req, res) => {
  try {
    const pay = await renewSub(req.params.invoiceId, new Date());
    if (pay) {
      return res.status(200).json({ msg: "Subscription renewed" });
    } else {
      return res.status(404).json({ errors: ["Not found"] });
    }
  } catch (error) {
    return res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.getSubInvoices = async (req, res) => {
  try {
    const invoices = await renewSubInvoices();
    if (!invoices)
      return res.status(404).json({ errors: ["no invoices found"] });
    invoices.map((invoice) => {
      invoice.invoice =
        "https://mircle50-001-site1.atempurl.com/" + invoice.invoice;
    });
    return res.status(200).json({ data: invoices });
  } catch (error) {
    return res.status(500).json({ errors: ["Internal server error"] });
  }
};
