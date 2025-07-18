const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("Connection to the database successful");
    app.listen(3000, () => {
      console.log("Listening to the app on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
  });
