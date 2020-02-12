const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  if (!req.get("Authorization")) {
    return res
      .status(500)
      .json({ message: "Not authenticated 로그인 되지 않음" });
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(
      req.get("Authorization").split(" ")[1],
      process.env.SECRET
    );
    if (!decodedToken) {
      return res
        .status(500)
        .json({ message: "Not authenticated 로그인 되지 않음" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Not authenticated 로그인 되지 않음" });
  }
  req.userId = decodedToken._id;
  next();
};
