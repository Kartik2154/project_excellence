import Division from "../models/division.js";
import Enrollment from "../models/enrollment.js";

// GET /api/divisions - Get all divisions with optional filters
export const getAllDivisions = async (req, res) => {
  try {
    const { course, status } = req.query;
    let filter = {};

    if (course && course !== "All") filter.course = course;
    if (status && status !== "All") {
      filter.status = status.toLowerCase(); // assuming frontend sends 'Active'/'Inactive'
    }

    const divisions = await Division.find(filter).sort({
      year: -1,
      semester: 1,
    });

    // Capitalize status for frontend
    const divisionsWithCapitalizedStatus = divisions.map((div) => ({
      ...div.toObject(),
      status: div.status.charAt(0).toUpperCase() + div.status.slice(1),
    }));

    res.json(divisionsWithCapitalizedStatus);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/divisions - Create a new division
export const createDivision = async (req, res) => {
  try {
    const { course, semester, year, status } = req.body;

    // Validation
    if (!course || !semester || !year) {
      return res
        .status(400)
        .json({ message: "Course, semester, and year are required" });
    }
    if (!/^[A-Za-z]+$/.test(course)) {
      return res
        .status(400)
        .json({ message: "Course must contain only letters" });
    }
    if (semester < 1 || semester > 8) {
      return res
        .status(400)
        .json({ message: "Semester must be between 1 and 8" });
    }
    if (year < 2000 || year > 2100) {
      return res
        .status(400)
        .json({ message: "Year must be between 2000 and 2100" });
    }

    const newDivision = new Division({
      course: course.toUpperCase(), // assuming BCA, MCA
      semester: parseInt(semester),
      year: parseInt(year),
      status: (status || "Active").toLowerCase(),
    });

    const savedDivision = await newDivision.save();

    // Return with capitalized status
    const response = {
      ...savedDivision.toObject(),
      status:
        savedDivision.status.charAt(0).toUpperCase() +
        savedDivision.status.slice(1),
    };

    res.status(201).json(response);
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(400)
        .json({
          message:
            "Division with this course, semester, and year already exists",
        });
    } else {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

// PATCH /api/divisions/:id/status - Toggle division status
export const updateDivisionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const division = await Division.findById(id);

    if (!division) {
      return res.status(404).json({ message: "Division not found" });
    }

    division.status = division.status === "active" ? "inactive" : "active";
    await division.save();

    // Return with capitalized status
    const response = {
      ...division.toObject(),
      status:
        division.status.charAt(0).toUpperCase() + division.status.slice(1),
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/divisions/:id - Delete a division and its enrollments
export const deleteDivision = async (req, res) => {
  try {
    const { id } = req.params;
    const division = await Division.findById(id);

    if (!division) {
      return res.status(404).json({ message: "Division not found" });
    }

    // Delete associated enrollments
    await Enrollment.deleteMany({ divisionId: id });

    // Delete the division
    await Division.findByIdAndDelete(id);

    res.json({
      message: "Division and associated enrollments deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
