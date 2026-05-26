const getAllowedOrigins = () => {
  const fromEnv = (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  const defaults = [
    "http://localhost:5173",
    "http://13.51.237.44",
    "http://13.51.237.44:5173",
    "https://gittogetherbuddies.onrender.com",
  ];

  return [...new Set([...defaults, ...fromEnv])];
};

const createCorsMiddleware = (allowedOrigins) =>
  require("cors")({
    origin(origin, callback) {
      // Non-browser clients (Postman, server-to-server) send no Origin header
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(
          `CORS blocked origin: "${origin}". Allowed: ${allowedOrigins.join(", ")}`
        );
        callback(new Error(`Origin ${origin} is not allowed by CORS`));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

module.exports = { getAllowedOrigins, createCorsMiddleware };
