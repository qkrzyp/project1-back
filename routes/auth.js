const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authControllers = require("../controllers/auth");

router.post(
  "/signup",
  [
    body("name", "이름은 필수 정보입니다.")
      .not()
      .isEmpty(),
    body("email", "이메일은 이메일 형식이어야만 합니다.").isEmail(),
    body("password", "비밀번호는 5글자 이상이어야 합니다.").isLength({
      min: 5
    }),
    body("phone", "-를 뺀 11자리 숫자만 입력해주세요.")
      .not()
      .isEmpty()
      .isLength({ min: 11, max: 11 })
      .isNumeric(),
    body("confirmPassword", "비밀번호가 일치하지 않습니다.")
      .not()
      .isEmpty()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }
        return true;
      })
  ],
  authControllers.signup
);

router.post(
  "/login",
  [
    body("email", "이메일은 이메일 형식이어야만 합니다.").isEmail(),
    body("password", "비밀번호는 5글자 이상이어야 합니다.").isLength({
      min: 5
    })
  ],
  authControllers.login
);

module.exports = router;
