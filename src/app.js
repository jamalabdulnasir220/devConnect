const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("Hello from the dashbaord!");
});

app.use("/test", (req, res) => {
  res.send("Hello this is the test");
});

app.use("/hello", (req, res) => {
  res.send("Hello hello hello!");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
