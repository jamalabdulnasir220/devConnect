const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const validator = require("validator");
const validateFunction = require("./utils/validation");
const bycrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const userAuth = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // Validate the request body for user signup
    validateFunction(req);

    // Encrypt the password before saving it to the database
    const hashedPassword = await bycrypt.hash(password, 10);
    console.log("Hashed password: ", hashedPassword);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.send("User created successfully!");
  } catch (error) {
    res.status(400).send("Error making request: " + error.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!validator.isEmail(email)) {
      throw new Error("Invalid credentials");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bycrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Generate a JWT token
    const token = await jwt.sign({ _id: user._id }, "DEVConnect@123");

    // store in a cookie and send response back to the user
    res.cookie("token", token);

    res.send("Login successful!");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("Something went wrong!");
  }
});

//Get a user from the database using a filter
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else res.send(user);
    // const user = await User.find({ email: userEmail });
    // if (user.length === 0) {
    //   res.status(404).send("User not found");
    // } else res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

// Delete user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong!");
  }
});

// Update user in the database
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    // Validate the skills field and set it to a maximum of 5 skills
    if (data.skills && data.skills.length > 5) {
      throw new Error("You can only have a maximum of 5 skills");
    }
    const UPDATES_ALLOWED = ["photo", "about", "skills", "gender", "age"];
    const isUpdatesAllowed = Object.keys(data).every((k) =>
      UPDATES_ALLOWED.includes(k)
    );

    if (!isUpdatesAllowed) {
      throw new Error("Updates is not allowed on this field(s)");
    }

    await User.findByIdAndUpdate(userId, data, { runValidators: true });
    res.send("User updated successfully");
  } catch (error) {
    res.status(400).end("Something went wrong! " + error.message);
  }
});

// Get all users from the database
app.get("/feed", async (req, res) => {
  try {
    // This will return all the users from the database.
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong!");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection is not established..");
  });
