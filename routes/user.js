const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const userControllers = require("../controllers/user");

const isAuth = require("../middlewares/isAuth");

router.get("/user", isAuth, userControllers.getUser);

router.put(
  "/user",
  isAuth,
  [
    body("name", "이름은 필수 정보입니다.")
      .not()
      .isEmpty(),
    body("email", "이메일은 이메일 형식이어야만 합니다.").isEmail(),
    body("phone", "-를 뺀 11자리 숫자만 입력해주세요.")
      .not()
      .isEmpty()
      .isLength({ min: 11, max: 11 })
      .isNumeric()
  ],
  userControllers.editUser
);

router.get("/users", isAuth, userControllers.getAllUsers);

router.get("/user/order", isAuth, userControllers.getUserOrder);

module.exports = router;
