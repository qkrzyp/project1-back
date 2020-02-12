const Order = require("../models/order");
const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.createOrder = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(400).json({
        error: "Not authenticated"
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "validation failed",
        error: errors.array()
      });
    }

    const name = req.body.name;
    const address = req.body.address;
    const phone = req.body.phone;
    const email = req.body.email;
    const products = req.body.products;
    const payment = req.body.payment;
    const totalPrice = req.body.totalPrice;

    let savedOrder;
    const order = new Order({
      name,
      address,
      products,
      phone,
      email,
      payment,
      totalPrice,
      user: req.userId
    });
    savedOrder = await order.save();
    res.json(savedOrder);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: err.message,
        message: "order error"
      });
    }
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(400).json({
        error: "Not authenticated"
      });
    }

    const user = await User.findById(req.userId);
    if (user.admin === false) {
      return res.status(400).json({
        error: "Admin only"
      });
    }

    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    if (err) {
      return res.status(500).json({
        error: err.message,
        message: "order error"
      });
    }
  }
};
