const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photo age skills about gender";

const USER_SAFE_PROJECT = {
  firstName: 1,
  lastName: 1,
  photo: 1,
  age: 1,
  skills: 1,
  about: 1,
  gender: 1,
};

const parsePagination = (query) => {
  const page = parseInt(query.page, 10) || 1;
  let limit = parseInt(query.limit, 10) || 10;
  limit = limit > 50 ? 50 : limit;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { limit, skip } = parsePagination(req.query);

    const receivedRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "Interested",
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

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
    const { limit, skip } = parsePagination(req.query);

    const connectionsWithDetails = await ConnectionRequestModel.aggregate([
      {
        $match: {
          $or: [
            { fromUserId: loggedInUser._id, status: "Accepted" },
            { toUserId: loggedInUser._id, status: "Accepted" },
          ],
        },
      },
      { $sort: { updatedAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "fromUserId",
          foreignField: "_id",
          pipeline: [{ $project: USER_SAFE_PROJECT }],
          as: "fromUser",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "toUserId",
          foreignField: "_id",
          pipeline: [{ $project: USER_SAFE_PROJECT }],
          as: "toUser",
        },
      },
      { $unwind: "$fromUser" },
      { $unwind: "$toUser" },
      {
        $replaceRoot: {
          newRoot: {
            $cond: {
              if: { $eq: ["$fromUserId", loggedInUser._id] },
              then: "$toUser",
              else: "$fromUser",
            },
          },
        },
      },
    ]);

    if (connectionsWithDetails.length === 0) {
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
    const { limit, skip } = parsePagination(req.query);

    const feedUsers = await User.aggregate([
      { $match: { _id: { $ne: loggedInUser._id } } },
      {
        $lookup: {
          from: "connectionrequestmodels",
          let: { candidateId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $eq: ["$fromUserId", loggedInUser._id] },
                        { $eq: ["$toUserId", "$$candidateId"] },
                      ],
                    },
                    {
                      $and: [
                        { $eq: ["$fromUserId", "$$candidateId"] },
                        { $eq: ["$toUserId", loggedInUser._id] },
                      ],
                    },
                  ],
                },
              },
            },
            { $limit: 1 },
          ],
          as: "connectionWithMe",
        },
      },
      { $match: { connectionWithMe: { $eq: [] } } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: USER_SAFE_PROJECT },
    ]);

    res.status(200).json({
      message: "Feed retrieved successfully",
      feedUsers,
    });
  } catch (error) {
    res.status(400).json({ message: `ERROR: ${error.message}` });
  }
});

module.exports = userRouter;
