const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const receivedRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "Interested",
    }).populate("fromUserId", ["firstName", "lastName", "photo", "age", "skills"]);

    if (receivedRequests.length === 0) {
      return res.status(404).send("No connection requests received");
    }

    // // Map over the received requests to include user details
    // const receivedRequestsWithDetails = await Promise.all(
    //   receivedRequests.map(async (request) => {
    //     const user = await User.findById(request.fromUserId);
    //     return {
    //       ...request.toObject(),
    //       User: {
    //         _id: user._id,
    //         name: user.firstName + " " + user.lastName,
    //         email: user.email,
    //       },
    //     };
    //   })
    // );

    // Send the response with the received requests

    res.status(200).json({
      message: "Connection requests received successfully",
      receivedRequests,
    });
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

module.exports = userRouter;
