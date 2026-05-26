const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Unauthorized: Token is missing");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedToken;

    const user = await User.findById(_id).select("-password");
    if (!user) {
      return res.status(404).send("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized: Invalid token " + error.message);
  }
};

module.exports = userAuth;
