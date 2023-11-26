const connection = require("../DB/dbConnection");
const util = require("util");

exports.add = async (data1, data2) => {
  try {
    const query = util.promisify(connection.query).bind(connection);
    await query("INSERT INTO orders SET ?", [data1, data2]);
  } catch (error) {
    throw error;
  }
};

exports.get = async (data) => {
  const query = util.promisify(connection.query).bind(connection);
  const driver = await query("SELECT * FROM drivers WHERE id = ?", [data]);
  const currentDate = new Date();
  const subscriptionDate = new Date(driver[0].subscription_date); // Convert timestamp to Date object

  // Check if the subscription is expired
  if (!isSubscriptionActive(subscriptionDate, currentDate)) {
    return false;
  }

  return await query(`
    SELECT id, region, regionRecipient, name FROM orders
    WHERE status = 'Pending' AND paid = 0 AND driverId IS NULL
  `);
};

// Helper function to check if the subscription is active
function isSubscriptionActive(subscriptionDate, currentDate) {
  const subscriptionDuration = 30; // Subscription duration in days
  const expirationDate = new Date(subscriptionDate);
  expirationDate.setDate(expirationDate.getDate() + subscriptionDuration);

  return currentDate <= expirationDate;
}

exports.getOne = async (id) => {
  const query = util.promisify(connection.query).bind(connection);
  return await query("SELECT * FROM orders WHERE id = ?", [id]);
};

exports.getMyOrders = async (id) => {
  const query = util.promisify(connection.query).bind(connection);
  const results = await query(
    "SELECT orders.id AS order_id, orders.region, orders.regionRecipient, orders.name, orders.status, offers.id AS offer_id, offers.fullName, offers.price, offers.phoneNumber, offers.user_id FROM orders LEFT JOIN offers ON orders.id = offers.order_id WHERE orders.user_id = ?",
    [id]
  );

  const mappedResults = [];

  results.forEach((result) => {
    const orderIndex = mappedResults.findIndex(
      (order) => order.order_id === result.order_id
    );

    if (orderIndex === -1) {
      const order = {
        order_id: result.order_id,
        region: result.region,
        regionRecipient: result.regionRecipient,
        name: result.name,
        status: result.status,
        num_of_offers: 0,
        offers: [],
      };
      if (result.offer_id) {
        order.offers.push({
          offer_id: result.offer_id,
          fullName: result.fullName,
          price: result.price,
          phoneNumber: result.phoneNumber,
          driverId: result.user_id,
        });
        order.num_of_offers = 1;
      }
      mappedResults.push(order);
    } else {
      if (result.offer_id) {
        mappedResults[orderIndex].offers.push({
          offer_id: result.offer_id,
          fullName: result.fullName,
          price: result.price,
          phoneNumber: result.phoneNumber,
          driverId: result.user_id,
        });
        mappedResults[orderIndex].num_of_offers++;
      }
    }
  });

  return mappedResults;
};

exports.getOrder = async (id) => {
  const query = util.promisify(connection.query).bind(connection);
  const results = await query(
    "SELECT orders.id AS order_id, orders.region, orders.regionRecipient, orders.name, orders.status, offers.id AS offer_id, offers.fullName, offers.price, offers.phoneNumber, offers.user_id FROM orders LEFT JOIN offers ON orders.id = offers.order_id WHERE orders.id = ?",
    [id]
  );

  const mappedResults = [];

  for (const result of results) {
    const {
      order_id,
      region,
      regionRecipient,
      name,
      status,
      offer_id,
      fullName,
      price,
      phoneNumber,
      user_id,
    } = result;

    const orderIndex = mappedResults.findIndex(
      (order) => order.order_id === order_id
    );

    if (orderIndex === -1) {
      const order = {
        order_id,
        region,
        regionRecipient,
        name,
        status,
        num_of_offers: 0,
        offers: [],
      };

      if (offer_id) {
        order.offers.push({
          offer_id,
          fullName,
          price,
          phoneNumber,
          driverId: user_id,
        });
        order.num_of_offers = 1;
      }

      mappedResults.push(order);
    } else {
      if (offer_id) {
        mappedResults[orderIndex].offers.push({
          offer_id,
          fullName,
          price,
          phoneNumber,
          driverId: user_id,
        });
        mappedResults[orderIndex].num_of_offers++;
      }
    }
  }

  return mappedResults;
};

exports.getDriverOrders = async (id) => {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const orders = await query(
      "select * from orders where driverId = ? and status = 'Invoice Sent'",
      [id]
    );
    return orders;
  } catch (error) {
    console.error(error);
  }
};

exports.deleteOrder = async (id) => {
  const query = util.promisify(connection.query).bind(connection);
  await query("Delete FROM orders WHERE id = ?", [id]);
};
