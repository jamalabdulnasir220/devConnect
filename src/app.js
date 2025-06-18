const express = require("express");

const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.use("/admin/getAllUsers", (req, res) => {
  res.send("All the users are here!");
});

app.use("/admin/deleteAllUsers", (req, res) => {
  res.send("The user has been deleted!");
});

app.use("/user", userAuth, (req, res) => {
  res.send("Main user");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
