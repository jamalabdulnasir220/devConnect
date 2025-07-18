const express = require("express");
const authRouter = express.Router();

const validateFunction = require("../utils/validation");
const User = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the req
    validateFunction(req);
    const { firstName, lastName, email, password } = req.body;
    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(400).send("Error creating user: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Email is not valid");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Incorrect credentials");
    }
    const isPasswordValid = user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Incorrect credentials");
    }

    const token = await user.getJWT()

    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
    res.send("Login Successful!!");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = authRouter;
