const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photo age skills about gender";

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const receivedRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "Interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    // if (receivedRequests.length === 0) {
    //   return res.send("No connection requests received");
    // }

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

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "Accepted" },
        { toUserId: loggedInUser._id, status: "Accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const connectionsWithDetails = connections.map((connection) => {
      if (connection.fromUserId._id.equals(loggedInUser._id)) {
        return connection.toUserId;
      } else return connection.fromUserId;
    });

    if (connections.length === 0) {
      return res.status(404).json({
        message: "No connections found",
      });
    }
    res.status(200).json({
      message: "Connections retrieved successfully",
      connections: connectionsWithDetails,
    });
  } catch (error) {
    res.status(400).json({ message: `ERROR: ${error.message}` });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit; // Limit to a maximum of 50 results per page
    const skip = (page - 1) * limit;

    // For the feed,
    // if we are logged in as user A,
    // we shouldn't see the user A's profile,
    // we should'nt see the connections the user A has interested, ignored, accepted, rejected

    const connections = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connections.forEach((connection) => {
      hideUsersFromFeed.add(connection.fromUserId.toString());
      hideUsersFromFeed.add(connection.toUserId.toString());
    });

    console.log("Hide users from feed:", hideUsersFromFeed);
    // Ensure the logged in user's own ID is not in the hideUsersFromFeed set
    hideUsersFromFeed.add(loggedInUser._id.toString());
    
    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Feed retrieved successfully",
      feedUsers,
    });
  } catch (error) {
    res.status(400).json({ message: `ERROR: ${error.message}` });
  }
});

module.exports = userRouter;
