const mongoose = require("mongoose");
const validator = require("validator");

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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough");
        }
      },
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
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Photo URL is not valid");
        }
      },
      default:
        "https://res.cloudinary.com/dz1qj3x8h/image/upload/v1698231234/placeholder.png",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
