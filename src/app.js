const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const http = require("http");
// const swaggerUi = require("swagger-ui-express");
// const YAML = require("yamljs");
require("dotenv").config();

const { getAllowedOrigins, createCorsMiddleware } = require("./config/cors");

const app = express();

const allowedOrigins = getAllowedOrigins();
app.use(createCorsMiddleware(allowedOrigins));

// Behind nginx / ALB on AWS
app.set("trust proxy", 1);

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utils/socket");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

const startServer = async () => {
  await connectDB();
  console.log("Connection to the database successful");
  console.log("CORS allowed origins:", allowedOrigins.join(", "));

  const server = http.createServer(app);
  initializeSocket(server, allowedOrigins);

  const port = process.env.PORT;
  server.listen(port, () => {
    console.log(`Listening to the app on port ${port}`);
  });
};

startServer().catch((err) => {
  console.error("Error starting server", err);
  process.exit(1);
});
