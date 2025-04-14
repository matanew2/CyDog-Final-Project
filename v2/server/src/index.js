require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");
const sequelize = require("./config/db");
const initSocket = require("./socket");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const fs = require("fs");

// Import routes
const authRoutes = require("./routes/auth");
const dogsRoutes = require("./routes/dogs");
const assignmentsRoutes = require("./routes/assignments");

// Import models
const { User, Dog, Assignment } = require("./models");

// Security packages
let helmet, rateLimit;
try {
  helmet = require("helmet");
  rateLimit = require("express-rate-limit");
} catch (error) {
  console.warn(
    "Security packages not installed. Run: npm install helmet express-rate-limit"
  );
  helmet = () => (req, res, next) => next();
  rateLimit = () => (req, res, next) => next();
}

const app = express();
const server = http.createServer(app);

// CORS configuration - Must come before security headers
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000", // Specific origin instead of wildcard
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  credentials: true,
  exposedHeaders: ["Content-Disposition"],
};
app.use(cors(corsOptions));

// Security headers - Configure to allow cross-origin resources
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
  })
);

// Create upload directories if they don't exist
const uploadDir = path.join(__dirname, "public/uploads");
const dogUploadDir = path.join(__dirname, "public/uploads/dogs");

// Create directories if they don't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created uploads directory");
}
if (!fs.existsSync(dogUploadDir)) {
  fs.mkdirSync(dogUploadDir, { recursive: true });
  console.log("Created dogs upload directory");
}

// Custom middleware for serving dog images with specific CORS headers
app.use(
  "/uploads/dogs",
  (req, res, next) => {
    // Match the same origin as in corsOptions
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.CORS_ORIGIN || "http://localhost:3000"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "public/uploads/dogs"))
);

// Then serve the general uploads directory
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Body parser
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Parse cookies
app.use(cookieParser());

// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
  },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessionConfig.cookie.secure = true;
}

app.use(session(sessionConfig));

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Add request timestamp middleware
app.use((req, res, next) => {
  req.requestTime = new Date();
  next();
});

// Add a debug endpoint to check the file
app.get("/debug-image/:filename", (req, res) => {
  const filePath = path.join(
    __dirname,
    "public/uploads/dogs",
    req.params.filename
  );
  res.json({
    fileExists: fs.existsSync(filePath),
    filePath,
    fileStats: fs.existsSync(filePath) ? fs.statSync(filePath) : null,
    headers: {
      "content-type": "image/jpeg",
      "access-control-allow-origin":
        process.env.CORS_ORIGIN || "http://localhost:3000",
    },
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/dogs", dogsRoutes);
app.use("/assignments", assignmentsRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found", path: req.path });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
});

// Initialize socket.io
initSocket(server);

// Database connection and server start
const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    console.log("Syncing User model...");
    await User.sync({ force: process.env.NODE_ENV === "development" });
    console.log("User model synced.");

    console.log("Syncing Dog model...");
    await Dog.sync({ force: process.env.NODE_ENV === "development" });
    console.log("Dog model synced.");

    console.log("Syncing Assignment model...");
    await Assignment.sync({ force: process.env.NODE_ENV === "development" });
    console.log("Assignment model synced.");

    console.log("Database models synchronized.");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(
        `API documentation available at http://localhost:${PORT}/api-docs`
      );
      console.log(`Socket.io server running at http://localhost:${PORT}`);
      console.log(
        `Dog images accessible at http://localhost:${PORT}/uploads/dogs/[filename]`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    sequelize.close().then(() => {
      console.log("Database connection closed");
      process.exit(0);
    });
  });
});

startServer();
