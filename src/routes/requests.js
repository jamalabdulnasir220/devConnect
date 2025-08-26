const express = require("express");
const ConnectionRequestModel = require("../models/connectionRequest");
const requestRouter = express.Router();
const User = require("../models/user");

const userAuth = require("../middlewares/auth");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatuses = ["Interested", "Ignored"];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: `Invalid status: ${status}. Allowed statuses are: ${allowedStatuses.join(
            ", "
          )}`,
        });
      }

      // check if the toUserId does not exists in the database
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      // If there is an existing connection request from the same user to the same recipient, or from the recipien to the same user
      const existingRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res
          .status(400)
          .json({ messsage: "Connection already exists between these users." });
      }

      // // If you are sending a request to yourself
      // if (fromUserId.toString() === toUserId.toString()) {
      //   return res
      //     .status(400)
      //     .json({
      //       message: "You cannot send a connection request to yourself.",
      //     });
      // }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      const savedRequest = await connectionRequest.save();
      res.status(201).json({
        message: "Connection request sent successfully",
        savedRequest,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      // let's say Jamal has sent a request to Abdallah
      // loggedInuser = Abdallah
      // status sent must be interested, if it is ignored you shouldn't see the request
      // requestId should be valid and should be the request that was sent to you
      const allowedStatuses = ["Accepted", "Rejected"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: `Invalid status: ${status}. Allowed statuses are: ${allowedStatuses.join(
            ", "
          )}`,
        });
      }

      // check if the requesId is valid
      if (!requestId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: "Invalid request ID format." });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "Interested",
      });
      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found",
        });
      }
      connectionRequest.status = status;

      const updatedRequest = await connectionRequest.save();

      res.status(200).json({
        message: `Connection request ${status} successfully`,
        updatedRequest,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

module.exports = requestRouter;
