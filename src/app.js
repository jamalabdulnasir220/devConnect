const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Abdallah",
    lastName: "'Saeed'",
    email: "abdallah@gmail.com",
    password: "12345",
  });

  try {
    await user.save();
    res.send("User created successfully!");
  } catch (error) {
    res.status(400).send("Error making request: " + error.message);
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
