require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const Student = require('./models/Student');
const Admin = require('./models/Admin');

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Clear existing data (optional - remove if you want to keep existing)
        await Student.deleteMany({});
        await Admin.deleteMany({});
        console.log("Cleared existing data");

        // Create Admin
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = new Admin({
            name: "System Administrator",
            email: "admin@gmail.com",
            password: adminPassword,
            collegeCode: "PCCOE",
            sealUrl: ""
        });
        await admin.save();
        console.log("✅ Admin created");

        // Create Student Aryan
        const studentPassword = await bcrypt.hash('aryan123', 10);
        const student = new Student({
            name: "Aryan Patil",
            email: "aryan@gmail.com",
            password: studentPassword,
            studentId: "ARYAN001",
            collegeCode: "PCCOE"
        });
        await student.save();
        console.log("✅ Student Aryan created");

        console.log("\n=========================================");
        console.log("✅ SEED DATA COMPLETED!");
        console.log("=========================================");
        console.log("\n📋 LOGIN CREDENTIALS:");
        console.log("\n🔐 ADMIN LOGIN:");
        console.log("   Email: admin@gmail.com");
        console.log("   Password: admin123");
        console.log("   College Code: PCCOE");
        
        console.log("\n👨‍🎓 STUDENT LOGIN:");
        console.log("   Email: aryan@gmail.com");
        console.log("   Password: aryan123");
        console.log("   College Code: PCCOE");
        console.log("=========================================\n");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();