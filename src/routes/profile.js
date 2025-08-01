const express = require("express");
const profileRouter = express.Router();

const { validateEditProfile } = require("../utils/validation");
const bcrypt = require("bcrypt");
const userAuth = require("../middlewares/auth");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Update is not allowed");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    res.json({
      message: `Profile updated successfully for ${loggedInUser.firstName}`,
      data: loggedInUser,
    });

    res.send(user);
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new Error("Old password and new password are required");
    }
    const loggedInUser = req.user;
    const isPasswordValid = loggedInUser.validatePassword(oldPassword);
    if (!isPasswordValid) {
      throw new Error("Old password is incorrect");
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = hashedNewPassword;
    await loggedInUser.save();
    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

module.exports = profileRouter;
