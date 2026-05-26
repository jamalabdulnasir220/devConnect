const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
// const swaggerUi = require("swagger-ui-express");
// const YAML = require("yamljs");
require("dotenv").config();

const app = express();

// Load Swagger specification from YAML file
// const swaggerSpec = YAML.load("./src/swagger.yaml");

app.use(
  cors({
    origin: [
      "http://13.51.237.44",
      "http://localhost:5173",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

// Swagger UI route
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

  const server = http.createServer(app);
  initializeSocket(server);

  const port = process.env.PORT;
  server.listen(port, () => {
    console.log(`Listening to the app on port ${port}`);
  });
};

startServer().catch((err) => {
  console.error("Error starting server", err);
  process.exit(1);
});
