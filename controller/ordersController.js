const ordersService = require("../services/ordersServices");
const fs = require("fs");
const { nanoid } = require("nanoid");

exports.orderDetails = async (req, res) => {
  try {
    const nId1 = nanoid(10);

    if (!req.file) {
      // Check if image file exists
      return res.status(400).json({
        errors: [{ msg: "Image is Required" }],
      });
    }
    const currentDate = new Date();

    // INSERT NEW DISH
    const data = {
      id: nId1,
      region: req.body.region,
      location: req.body.location,
      buildingNumber: req.body.buildingNumber, // Use the filename of the uploaded image
      floor: req.body.floor,
      apartmentNumber: req.body.apartmentNumber,
      specialSign: req.body.specialSign,
      phoneNumber: req.body.phoneNumber,
      regionRecipient: req.body.regionRecipient,
      locationRecipient: req.body.locationRecipient,
      buildingNumberRecipient: req.body.buildingNumberRecipient, // Use the filename of the uploaded image
      floorRecipient: req.body.floorRecipient,
      apartmentNumberRecipient: req.body.apartmentNumberRecipient,
      specialSignRecipient: req.body.specialSignRecipient,
      phoneNumberRecipient: req.body.phoneNumberRecipient,
      description: req.body.description,
      name: req.body.name,
      image: req.file.filename, // Use the filename of the uploaded image
      weight: req.body.Weight,
      humidity: req.body.humidity,
      temperature: req.body.temperature,
      locationFreight: req.body.locationFreight,
      user_id: req.user.id,
      date: currentDate,
    };

    await ordersService.add(data, req.body);

    res.status(200).json({
      msg: "Order added successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await ordersService.get(req.user.id);
    if (!orders) {
      res.status(200).json({ msg: "You need to re-subscribe" });
    }
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await ordersService.getOne(req.params.id);
    if (order.length > 0) {
      const senderInfo = {
        region: order[0].region,
        location: order[0].location,
        buildingNumber: order[0].buildingNumber,
        floorNumber: order[0].floor,
        apartmentNumber: order[0].apartmentNumber,
        specialSign: order[0].specialSign,
        phoneNumber: order[0].phoneNumber,
      };
      const recipientInfo = {
        region: order[0].regionRecipient,
        location: order[0].locationRecipient,
        buildingNumber: order[0].buildingNumberRecipient,
        floorNumber: order[0].floorRecipient,
        apartmentNumber: order[0].apartmentNumberRecipient,
        specialSign: order[0].specialSignRecipient,
        phoneNumber: order[0].phoneNumberRecipient,
      };
      const freightInfo = {
        description: order[0].description,
        name: order[0].name,
        weight: order[0].weight,
        humidity: order[0].humidity,
        temperature: order[0].temperature,
        locationFreight: order[0].locationFreight,
      };

      res.status(200).json({ senderInfo, recipientInfo, freightInfo });
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  } catch (error) {
    res.status(500).json({ errors: ["Internal server error"] });
  }
};

exports.getOneOrder = async (req, res) => {
  try {
    const order = await ordersService.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }
    return res.status(200).json({ data: order });
  } catch (error) {
    res.status(500).json({ errors: "internal error" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const myOrders = await ordersService.getMyOrders(req.user.id);
    if (myOrders.length > 0) {
      return res.status(200).json(myOrders);
    } else {
      return res.status(404).json({ msg: "No orders found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
};

exports.getDriversOrders = async (req, res) => {
  try {
    const driverOrders = await ordersService.getDriverOrders(req.user.id);
    if (driverOrders.length > 0) {
      return res.status(200).json(driverOrders);
    } else {
      return res.status(404).json({ msg: "No orders found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: "Internal Server Error" });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await ordersService.getOne(req.params.id);
    if (order.length <= 0) {
      return res.status(404).json({ msg: "Order Not Found" });
    }
    fs.unlinkSync("./upload/" + order[0].image);

    await ordersService.deleteOrder(req.params.id);
    return res.status(200).json({ msg: "Deleted Success " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
