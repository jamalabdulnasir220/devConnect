const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["Interested", "Ignored", "Accepted", "Rejected"],
        message: "{VALUE} is not a valid status",
      },
    },
  },
  { timestamps: true }
);

// This will be called before saving the connection request
// It can be used to perform any pre-save operations, like validation or logging

connectionRequestSchema.pre("save", async function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send a connection request to yourself.");
  }
  next()
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequestModel",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
