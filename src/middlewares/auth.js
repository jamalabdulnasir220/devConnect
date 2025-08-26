const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // read the cookies from the request
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).send("Unauthorized: Token is missing");
    }

    // verify the token
    const decodedToken = await jwt.verify(token, "DevConnect@123");
    const { _id } = decodedToken;

    // find the user in the database
    const user = await User.findById(_id);
    if (!user) {
      res.status(404).send("User not found");
    }
    // attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized: Invalid token " + error.message);
  }
};

module.exports = userAuth;



