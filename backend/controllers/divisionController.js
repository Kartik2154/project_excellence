import Division from "../models/division.js";

// GET /api/divisions - Get all divisions
export const getAllDivisions = async (req, res) => {
  try {
    const divisions = await Division.find({ status: "active" }).sort({
      year: -1,
      semester: 1,
    });
    res.json(divisions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
