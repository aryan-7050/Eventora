require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5001;

// ======================
// MODELS
// ======================
const Student = require("./models/Student");
const Admin = require("./models/Admin");

// ======================
// ENV CHECK
// ======================
console.log("=========================================");
console.log("ENVIRONMENT VARIABLES CHECK:");
console.log("PORT:", PORT);
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✓ Set" : "✗ Not set");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✓ Set" : "✗ Not set");
console.log("FRONTEND_URL:", process.env.FRONTEND_URL || "Not Set");
console.log("=========================================");

// ======================
// CORS
// ======================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ CORS Blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],
  })
);

// ======================
// MIDDLEWARE
// ======================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ======================
// REQUEST LOGGER
// ======================
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`
  );
  next();
});

// ======================
// DATABASE CONNECTION
// ======================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    console.log("Database:", mongoose.connection.db.databaseName);
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// ======================
// ROUTES
// ======================
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const eventRoutes = require("./routes/events");
const registrationRoutes = require("./routes/registrations");
const notificationRoutes = require("./routes/notifications");
const announcementRoutes = require("./routes/announcements");
const budgetRoutes = require("./routes/budget");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/admin-notifications", require("./routes/adminNotifications"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/student", require("./routes/student"));
app.use("/api/club", require("./routes/club"));

// ======================
// HOME ROUTE
// ======================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Eventora API is running 🚀",
  });
});

// ======================
// HEALTH CHECK
// ======================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// ======================
// DEBUG ROUTES
// ======================
app.get("/debug/students", async (req, res) => {
  try {
    const students = await Student.find().select("-password");

    res.json({
      count: students.length,
      students,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching students",
      error: err.message,
    });
  }
});

app.get("/debug/admin", async (req, res) => {
  try {
    const admin = await Admin.findOne();

    res.json({
      adminExists: !!admin,
      collegeCode: admin?.collegeCode || "NOT SET",
      email: admin?.email,
      name: admin?.name,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.get("/debug/status", (req, res) => {
  res.json({
    status: "Server Running",
    port: PORT,
    environment: process.env.NODE_ENV || "development",
    mongodb:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
  });
});

// ======================
// 404 HANDLER
// ======================
app.use((req, res) => {
  console.log(
    `[404] ${req.method} ${req.originalUrl} - Route Not Found`
  );

  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
});