const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 5,
      maxLength: 50,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      // custom validate function, this only works when creating a new user, not when updating...
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("gender passed is not valid");
        }
      },
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default: "This is about",
    },
    photo: {
      type: String,
      default:
        "data:image/png;base64,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",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
