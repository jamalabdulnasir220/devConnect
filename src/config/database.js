const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.DB_SECRET;
  if (!uri) {
    throw new Error("DB_SECRET environment variable is not set");
  }

  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });
};

module.exports = connectDB;
