const User = require("../models/user");
const { validationResult } = require("express-validator");
const Order = require("../models/order");

exports.getUser = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(400).json({
        error: "Not authenticated"
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({
        error: err.message,
        message: "get user error"
      });
    }
    user.password = undefined;
    res.json(user);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: err.message,
        message: "get user error"
      });
    }
  }
};

exports.editUser = async (req, res, next) => {
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
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({
        message: err.message,
        error: "edit user error"
      });
    }
    const email = req.body.email;
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      if (user.email !== email) {
        return res.status(400).json({
          message: "validation failed",
          error: [{ msg: "이미 사용되고 있는 이메일입니다.", param: "email" }]
        });
      }
    }
    user.name = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;
    const editedUser = await user.save();
    res.json(editedUser);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: err.message,
        message: "edit user error"
      });
    }
  }
};

exports.getAllUsers = async (req, res, next) => {
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

    const users = await User.find();
    res.json(users);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: err.message,
        message: "get all user error"
      });
    }
  }
};

exports.getUserOrder = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(400).json({
        error: "Not authenticated"
      });
    }

    const order = await Order.find({ user: req.userId });
    if (!order) {
      return res.json({
        order: "no order"
      });
    }
    res.json(order);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        error: err.message,
        message: "get user order error"
      });
    }
  }
};
