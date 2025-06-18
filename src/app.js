const express = require("express");

const app = express();

app.all("/", (req, res) => {
  res.send("Hello");
});

app.all("/again", (req, res) => {
  res.send("HI");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
