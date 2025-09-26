import mongoose from "mongoose";
import dotenv from "dotenv";

import Guide from "./models/guide.js";
import Division from "./models/division.js";
import Student from "./models/student.js";
import Enrollment from "./models/enrollment.js";
import Group from "./models/group.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await Guide.deleteMany({});
    await Division.deleteMany({});
    await Student.deleteMany({});
    await Enrollment.deleteMany({});
    await Group.deleteMany({});

    const guides = await Guide.create([
      {
        name: "Kartik Patel",
        email: "kartik.patel@college.edu",
        expertise: "MERN Stack",
        mobile: "9876543210",
        status: "Active",
      },
      {
        name: "Kittu Sharma",
        email: "kittu.sharma@college.edu",
        expertise: "Flutter",
        mobile: "9123456789",
        status: "Active",
      },
    ]);
    console.log("Guides inserted:", guides);

    const divisions = await Division.create([
      {
        course: "BCA",
        semester: 6,
        year: 2025,
        status: "active",
      },
      {
        course: "MCA",
        semester: 1,
        year: 2025,
        status: "active",
      },
    ]);
    console.log("Divisions inserted:", divisions);

    const students = await Student.create([
      {
        enrollmentNumber: "BCA2025001",
        studentName: "Zeel Desai",
        divisionId: divisions[0]._id,
        isRegistered: true,
      },
      {
        enrollmentNumber: "MCA2025001",
        studentName: "Aryan Shah",
        divisionId: divisions[1]._id,
        isRegistered: true,
      },
    ]);
    console.log("Students inserted:", students);

    const enrollments = await Enrollment.create([
      {
        divisionId: divisions[0]._id,
        enrollmentNumber: "BCA2025001",
        isRegistered: true,
        studentName: "Zeel Desai",
      },
      {
        divisionId: divisions[1]._id,
        enrollmentNumber: "MCA2025001",
        isRegistered: true,
        studentName: "Aryan Shah",
      },
    ]);
    console.log("Enrollments inserted:", enrollments);

    const groups = await Group.create([
      {
        name: "Alpha Team",
        guide: guides[0]._id,
        projectTitle: "E-commerce Platform",
        projectDescription:
          "A web-based platform for online shopping with secure payment gateways.",
        projectTechnology: "MERN Stack",
        year: 2025,
        members: [
          {
            name: "Zeel Desai",
            enrollment: "BCA2025001",
            className: "BCA 6",
          },
          {
            name: "Sanjay Patel",
            enrollment: "BCA2025002",
            className: "BCA 6",
          },
        ],
        status: "active",
      },
      {
        name: "Beta Squad",
        guide: guides[1]._id,
        projectTitle: "Real-time Chat App",
        projectDescription:
          "A real-time messaging application for secure communication.",
        projectTechnology: "Flutter",
        year: 2025,
        members: [
          {
            name: "Aryan Shah",
            enrollment: "MCA2025001",
            className: "MCA 1",
          },
          {
            name: "Kittu Shah",
            enrollment: "MCA2025002",
            className: "MCA 1",
          },
        ],
        status: "active",
      },
    ]);
    console.log("Groups inserted:", groups);

    console.log("Data seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.connection.close();
  }
};

const run = async () => {
  await connectDB();
  await seedData();
};

run();
