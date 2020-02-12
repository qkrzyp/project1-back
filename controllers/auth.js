const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "validation failed",
        error: errors.array()
      });
    }
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({
        message: "validation failed",
        error: [{ msg: "이미 사용되고 있는 이메일입니다.", param: "email" }]
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone
    });
    const signupSuccess = await user.save();
    if (!signupSuccess) {
      return res.status(500).json({ error: "signup error" });
    }

    res.json({ message: "signup success", signupSuccess });
  } catch (err) {
    if (err) {
      return res
        .status(500)
        .json({ error: "signup error", message: err.message });
    }
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({ error: "이메일이 존재하지 않습니다." });
    }

    const equal = await bcrypt.compare(password, user.password);
    if (!equal) {
      return res.status(500).json({ error: "비밀번호가 일치하지 않습니다." });
    }
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.SECRET
    );
    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        admin: user.admin,
        phone: user.phone
      }
    });
  } catch (err) {
    if (err) {
      return res
        .status(500)
        .json({ error: "login error", message: err.message });
    }
  }
};
