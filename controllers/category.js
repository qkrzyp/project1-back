const Category = require("../models/category");
const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.getCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        error: "No category exist"
      });
    }
    res.json(category);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        message: "get category error",
        error: err.message
      });
    }
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    if (err) {
      return res.status(400).json({
        message: "get all categories error",
        error: err.message
      });
    }
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "validation failed",
        error: errors.array()
      });
    }

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
    const category = new Category({
      name: req.body.name
    });
    const savedCategory = await category.save();
    res.json({ savedCategory, message: "카테고리가 생성되었습니다." });
  } catch (err) {
    if (err) {
      return res
        .status(500)
        .json({ message: "category create error", error: err.message });
    }
  }
};

exports.editCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "validation failed",
        error: errors.array()
      });
    }

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

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({
        error: "No category exist"
      });
    }
    category.name = req.body.name;
    const edited = await category.save();
    res.json({
      edited,
      message: "카테고리가 수정되었습니다."
    });
  } catch (err) {
    if (err) {
      return res.status(500).json({
        message: "category edited error",
        error: err.message
      });
    }
  }
};

exports.deleteCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;

  try {
    if (!req.userId) {
      return res.status(400).json({
        error: "Not same user"
      });
    }

    const user = await User.findById(req.userId);
    if (user.admin === false) {
      return res.status(400).json({
        error: "Admin only"
      });
    }

    await Category.findByIdAndRemove(categoryId);
    res.json({ message: "Delete category success", _id: categoryId });
  } catch (err) {
    if (err) {
      return res.status(500).json({
        message: "category edit error",
        error: err.message
      });
    }
  }
};
