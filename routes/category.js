const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const categoryControllers = require("../controllers/category");

const isAuth = require("../middlewares/isAuth");

router.get("/category/:categoryId", categoryControllers.getCategory);

router.get("/categories", categoryControllers.getAllCategories);

router.post(
  "/category/create",
  [
    body("name", "이름은 필수 사항입니다.")
      .not()
      .isEmpty()
  ],
  isAuth,
  categoryControllers.createCategory
);

router.put(
  "/category/:categoryId",
  [
    body("name", "이름은 필수 사항입니다.")
      .not()
      .isEmpty()
  ],
  isAuth,
  categoryControllers.editCategory
);

router.delete(
  "/category/:categoryId",
  isAuth,
  categoryControllers.deleteCategory
);

module.exports = router;
