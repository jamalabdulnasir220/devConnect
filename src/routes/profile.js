const express = require("express")
const profileRouter = express.Router()

const userAuth = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});


module.exports = profileRouter