const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Jamal:Abdul8smwbb8@devconnect.x5j9kp0.mongodb.net/devConnect"
  );
};

module.exports = connectDB