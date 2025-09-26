import Student from "../models/student.js";
import Division from "../models/division.js";

// GET /api/students - Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate(
      "divisionId",
      "course semester year"
    );
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/students/available - Get students not in any group
export const getAvailableStudents = async (req, res) => {
  try {
    const { course, semester, year } = req.query;
    let filter = {};

    if (course) filter.course = course;
    if (semester) filter.semester = semester;
    if (year) filter.year = year;

    // Get all groups and their members
    const Group = (await import("../models/group.js")).default;
    const groups = await Group.find({});
    const assignedEnrollments = groups.flatMap((g) =>
      g.members.map((m) => m.enrollment)
    );

    // Get divisions
    const divisions = await Division.find(filter);
    const divisionIds = divisions.map((d) => d._id);

    // Get students not assigned to groups
    const students = await Student.find({
      divisionId: { $in: divisionIds },
      enrollmentNumber: { $nin: assignedEnrollments },
    }).populate("divisionId", "course semester year");

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
