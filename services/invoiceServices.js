const connection = require("../DB/dbConnection");
const util = require("util");

async function sendInvoice(data) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    await query("UPDATE orders SET status = 'Invoice Sent' WHERE id = ?", [
      data.orderId,
    ]);
    return await query("INSERT INTO invoices SET ?", [data]);
  } catch (error) {
    console.error(error);
  }
}

async function getInvoices() {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const invoices = await query("SELECT * FROM invoices");
    return invoices;
  } catch (error) {
    console.error(error);
  }
}

async function acceptInvoice(invoiceId, orderId) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const driver = await query("SELECT * FROM invoices where id = ?", [
      invoiceId,
    ]);
    const deleted = await query("DELETE FROM invoices WHERE id = ?", [
      invoiceId,
    ]);
    const updated = await query(
      "UPDATE orders SET paid = 1, driverId = ? where id = ?",
      [driver[0].driverId, orderId]
    );
    if (updated && deleted) {
      return driver;
    }
  } catch (error) {
    console.error(error);
  }
}

async function delevired(id) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    return await query("UPDATE orders SET status = 'Delivered' where id = ?", [
      id,
    ]);
  } catch (error) {
    console.error(error);
  }
}

async function driverSubscription(data) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    await query("UPDATE drivers SET status = 'Waiting' WHERE id = ?", [
      data.driverId,
    ]);
    return await query("INSERT INTO subscriptions SET ?", [data]);
  } catch (error) {
    console.error(error);
  }
}
async function renewSubInvoices() {
  try {
    const query = util.promisify(connection.query).bind(connection);
    return await query("select * from subscriptions");
  } catch (error) {
    console.error(error);
  }
}

async function renewSub(invoiceId, Date) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const invoice = await query("select * from subscriptions where id = ?", [
      invoiceId,
    ]);
    const update = await query(
      "UPDATE drivers SET subscription_date = ?, subscription = 1 , status = 'Accepted' where id = ?",
      [Date, invoice[0].driverId]
    );
    return await query("DELETE FROM subscriptions WHERE id = ?", [
      invoice[0].id,
    ]);
  } catch (error) {
    console.error(error);
  }
}
module.exports = {
  sendInvoice,
  getInvoices,
  acceptInvoice,
  delevired,
  driverSubscription,
  renewSub,
  renewSubInvoices,
};
