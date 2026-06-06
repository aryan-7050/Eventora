require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Debug: Check if .env is loading
console.log("=========================================");
console.log("ENVIRONMENT VARIABLES CHECK:");
console.log("PORT:", process.env.PORT);
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✓ Set" : "✗ Not set");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "✓ Set" : "✗ Not set");
console.log("=========================================");

const app = express();

// Models
const Student = require('./models/Student');
const Admin = require('./models/Admin'); // Add this for debug

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL?.replace(/\/$/, ""),
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log(`CORS blocked: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully");
        console.log("Database:", mongoose.connection.db.databaseName);
    })
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Routes
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');
const notificationRoutes = require('./routes/notifications');
const announcementRoutes = require('./routes/announcements');
const budgetRoutes = require('./routes/budget');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/admin-notifications', require('./routes/adminNotifications'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/student', require('./routes/student'));
app.use('/api/club', require('./routes/club'));

// Home Route
app.get("/", (req, res) => {
    res.send("EventMatrix API is running!");
});

// DEBUG ROUTES
app.get("/debug/students", async (req, res) => {
    try {
        const students = await Student.find().select('-password');
        res.json({
            count: students.length,
            students: students
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching students", error: err.message });
    }
});

// Debug: Check admin and college code
app.get("/debug/admin", async (req, res) => {
    try {
        const admin = await Admin.findOne();
        res.json({
            adminExists: !!admin,
            collegeCode: admin?.collegeCode || 'NOT SET',
            email: admin?.email,
            name: admin?.name
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Debug: Check server status
app.get("/debug/status", (req, res) => {
    res.json({
        status: "Server is running",
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
    });
});

// Catch-all 404 Logger
app.use((req, res) => {
    console.log(`[404 Error] ${req.method} ${req.originalUrl} - Not Found`);
    res.status(404).json({
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

// Start Server - FORCE to use port 5001
const PORT = process.env.PORT || 5001; 

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Frontend should connect to: http://localhost:${PORT}`);
   
});