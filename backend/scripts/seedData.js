import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Division from "../models/division.js";
import Student from "../models/student.js";
import Guide from "../models/guide.js";
import Group from "../models/group.js";
import Enrollment from "../models/enrollment.js";
import db from "../config/db.js";

// Connect to the database
db();

// Sample data
const divisions = [
  {
    course: "BCA",
    semester: 5,
    year: 2023,
    status: "active",
  },
  {
    course: "MCA",
    semester: 3,
    year: 2024,
    status: "active",
  },
];

const students = [
  {
    enrollmentNumber: "12345",
    studentName: "Kartik",
    divisionId: null, // Will be set after divisions are inserted
    isRegistered: true,
  },
  {
    enrollmentNumber: "12346",
    studentName: "Kittu",
    divisionId: null, // Will be set after divisions are inserted
    isRegistered: true,
  },
];

const guides = [
  {
    name: "Zeel",
    expertise: "Web Development",
    email: "zeel@example.com",
    phone: "1234567890",
    password: "password123",
    status: "approved",
    isActive: true,
  },
  {
    name: "Aryan",
    expertise: "Data Science",
    email: "aryan@example.com",
    phone: "0987654321",
    password: "password123",
    status: "approved",
    isActive: true,
  },
];

const groups = [
  {
    name: "Group 1",
    guide: null, // Will be set after guides are inserted
    projectTitle: "E-commerce Website",
    projectDescription: "A full-stack e-commerce application",
    projectTechnology: "React, Node.js",
    year: 2023,
    members: [
      { name: "Kartik", enrollment: "12345", className: "BCA 5" },
      { name: "Kittu", enrollment: "12346", className: "MCA 3" },
    ],
    status: "active",
  },
  {
    name: "Group 2",
    guide: null, // Will be set after guides are inserted
    projectTitle: "Data Analysis Tool",
    projectDescription: "A tool for analyzing large datasets",
    projectTechnology: "Python, Pandas",
    year: 2024,
    members: [{ name: "Sanjay", enrollment: "12347", className: "BCA 5" }],
    status: "active",
  },
];

const enrollments = [
  {
    enrollmentNumber: null, // Will be set after students are inserted
    divisionId: null, // Will be set after students are inserted
    studentName: null, // Will be set after students are inserted
    isRegistered: true,
  },
  {
    enrollmentNumber: null, // Will be set after students are inserted
    divisionId: null, // Will be set after students are inserted
    studentName: null, // Will be set after students are inserted
    isRegistered: true,
  },
];

// Function to seed data
const seedData = async () => {
  try {
    // Clear existing data
    await Division.deleteMany({});
    await Student.deleteMany({});
    await Guide.deleteMany({});
    await Group.deleteMany({});
    await Enrollment.deleteMany({});

    // Insert divisions
    const insertedDivisions = await Division.insertMany(divisions);
    console.log("Divisions inserted:", insertedDivisions);

    // Set divisionId for students
    students[0].divisionId = insertedDivisions[0]._id;
    students[1].divisionId = insertedDivisions[1]._id;

    // Insert students
    const insertedStudents = await Student.insertMany(students);
    console.log("Students inserted:", insertedStudents);

    // Insert guides
    const insertedGuides = await Guide.insertMany(guides);
    console.log("Guides inserted:", insertedGuides);

    // Set guide for groups
    groups[0].guide = insertedGuides[0]._id;
    groups[1].guide = insertedGuides[1]._id;

    // Insert groups
    const insertedGroups = await Group.insertMany(groups);
    console.log("Groups inserted:", insertedGroups);

    // Set enrollment data from students
    enrollments[0].enrollmentNumber = insertedStudents[0].enrollmentNumber;
    enrollments[0].divisionId = insertedStudents[0].divisionId;
    enrollments[0].studentName = insertedStudents[0].studentName;
    enrollments[1].enrollmentNumber = insertedStudents[1].enrollmentNumber;
    enrollments[1].divisionId = insertedStudents[1].divisionId;
    enrollments[1].studentName = insertedStudents[1].studentName;

    // Insert enrollments
    const insertedEnrollments = await Enrollment.insertMany(enrollments);
    console.log("Enrollments inserted:", insertedEnrollments);

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedData();
