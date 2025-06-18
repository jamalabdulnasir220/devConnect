const express = require("express");

const app = express();

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});

app.get("/getUserData", (req, res) => {
  try {
    throw new Error("There is an error");
    res.send("user data");
  } catch (err) {
    res.status(500).send("Error occured contact the support team")
  }
});



app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
