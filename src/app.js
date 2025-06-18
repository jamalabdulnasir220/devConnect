const express = require("express");

const app = express();

const authenticateMiddleware = (req, res, next) => {
  if (req.headers.authorization === "Bearer token") {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

const loggerMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

app.get("/protected", authenticateMiddleware, loggerMiddleware, (req, res) => {
  res.send("Protected Route");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 3000");
});
