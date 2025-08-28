const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const swaggerUi = require("swagger-ui-express");
// const YAML = require("yamljs");
require("dotenv").config();

const app = express();

// Load Swagger specification from YAML file
// const swaggerSpec = YAML.load("./src/swagger.yaml");

app.use(
  cors({
    origin: [
      "https://gittogetherbuddies.onrender.com",
      "http://localhost:3000",
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
app.use(cookieParser());

// Swagger UI route
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Connection to the database successful");
    app.listen(process.env.PORT, () => {
      console.log("Listening to the app on port 3000");
      // console.log(
      //   `Swagger UI available at: http://localhost:${
      //     process.env.PORT || 3000
      //   }/api-docs`
      // );
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database", err);
  });
