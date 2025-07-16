const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const connectDB = require("./config/database");
const User = require("./models/user");
const cookieParser = require("cookie-parser");
const validateFunction = require("./utils/validation");
const jwt = require("jsonwebtoken");
const userAuth = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      throw new Error("Email is not valid");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Incorrect credentials");
    }
    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Incorrect credentials");
    }

    const token = jwt.sign({ _id: user._id }, "DevConnect@123", {
      expiresIn: "1d",
    });

    res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) });
    res.send("Login Successful!!");
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  console.log("Send connection request");
  res.send(req.user?.firstName + " is Sending the request");
});

connectDB()
  .then(() => {
    console.log("Connection to the database successful");
    app.listen(3000, () => {
      console.log("Listening to the app on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
  });
