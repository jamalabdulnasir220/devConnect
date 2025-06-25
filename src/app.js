const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  // console.log(req.body);
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User created successfully!");
  } catch (error) {
    res.status(400).send("Error making request: " + error.message);
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
    if (data.skills && data.skills.length > 5 ) {
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
