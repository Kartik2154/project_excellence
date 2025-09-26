import Enrollment from "../models/enrollment.js";
import Division from "../models/division.js";

// GET /api/enrollments - Get all enrollments
export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate(
      "divisionId",
      "course semester year"
    );
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
