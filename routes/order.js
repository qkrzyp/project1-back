const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const orderControllers = require("../controllers/order");

const isAuth = require("../middlewares/isAuth");

router.post(
  "/order",
  isAuth,
  [
    body("name", "이름은 필수 정보입니다.")
      .not()
      .isEmpty(),
    body("email", "이메일은 이메일 형식이어야만 합니다.").isEmail(),
    body("address", "주소는 필수 정보입니다.")
      .not()
      .isEmpty(),
    body("phone", "-를 뺀 11자리 숫자만 입력해주세요.")
      .not()
      .isEmpty()
      .isLength({ min: 11, max: 11 })
      .isNumeric(),
    body("payment", "결제수단을 선택해 주세요.")
      .not()
      .isEmpty()
  ],
  orderControllers.createOrder
);

router.get("/orders", isAuth, orderControllers.getAllOrders);

module.exports = router;
