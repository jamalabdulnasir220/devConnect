const express = require("express");

const app = express();

app.use(
  "/some",
  (req, res, next) => {
    console.log("This is the first route handler");
    // res.send("First route handler");
     next();
  },
  (req, res) => {
    console.log("This is the second route handler");
    res.send("Second route handler");
  }
);

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
