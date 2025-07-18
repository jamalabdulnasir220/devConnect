const express = require("express")
const requestRouter = express.Router()

const userAuth = require("../middlewares/auth");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  console.log("Send connection request");
  res.send(req.user?.firstName + " is Sending the request");
});


module.exports = requestRouter