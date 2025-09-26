import mongoose from "mongoose";
import dotenv from "dotenv";

import Guide from "./models/guide.js";
import Group from "./models/group.js";
import Project from "./models/project.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
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
    await Group.deleteMany({});
    await Project.deleteMany({});

    // Seed minimal guides for groups
    const guides = await Guide.create([
      {
        name: "Kartik Patel",
        email: "kartik.patel@college.edu",
        expertise: "MERN Stack",
        phone: "9876543210",
        password: "password123",
        status: "approved",
      },
      {
        name: "Kittu Sharma",
        email: "kittu.sharma@college.edu",
        expertise: "Flutter",
        phone: "9123456789",
        password: "password123",
        status: "approved",
      },
    ]);
    console.log("Guides inserted:", guides.length);

    // Seed minimal groups for projects
    const groups = await Group.create([
      {
        name: "Group A",
        guide: guides[0]._id,
        projectTitle: "E-Commerce Platform",
        projectDescription: "A full-stack e-commerce platform with MERN stack",
        projectTechnology: "MERN Stack",
        year: 2025,
        members: [
          {
            name: "Student 1",
            enrollment: "ENR001",
            className: "MCA Sem-3",
          },
          {
            name: "Student 2",
            enrollment: "ENR002",
            className: "MCA Sem-3",
          },
        ],
        status: "active",
      },
      {
        name: "Group B",
        guide: guides[1]._id,
        projectTitle: "Mobile Task Manager",
        projectDescription:
          "A Flutter-based mobile application for task management",
        projectTechnology: "Flutter",
        year: 2025,
        members: [
          {
            name: "Student 3",
            enrollment: "ENR003",
            className: "BCA Sem-6",
          },
        ],
        status: "active",
      },
    ]);
    console.log("Groups inserted:", groups.length);

    // Seed projects
    const projects = await Project.create([
      {
        title: "E-Commerce Platform",
        description: "A full-stack e-commerce platform with MERN stack",
        technology: "MERN Stack",
        status: "In Progress",
        groupId: groups[0]._id,
      },
      {
        title: "Mobile Task Manager",
        description: "A Flutter-based mobile application for task management",
        technology: "Flutter",
        status: "Completed",
        groupId: groups[1]._id,
      },
    ]);
    console.log("Projects inserted:", projects.length);

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
