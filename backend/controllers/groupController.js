import Group from "../models/group.js";
import Guide from "../models/guide.js";
import Division from "../models/division.js";
import Enrollment from "../models/enrollment.js";

// GET /api/groups - Get all groups with optional filtering
export const getAllGroups = async (req, res) => {
  try {
    const { course, year, guide } = req.query;
    let filter = {};

    // Note: course filter removed as members are now refs, need aggregation for complex filter
    if (year) filter.year = year;
    if (guide) filter.guide = guide;

    const groups = await Group.find(filter)
      .populate("guide", "name email expertise mobile")
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/groups/:id - Get specific group details
export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id)
      .populate("guide", "name email expertise mobile")
      .populate("members", "enrollmentNumber studentName divisionId")
      .populate("members.divisionId", "course semester year");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/groups - Create new group
export const createGroup = async (req, res) => {
  try {
    const {
      name,
      guide,
      projectTitle,
      projectDescription,
      projectTechnology,
      year,
      members,
    } = req.body;

    // Validate guide exists and is active
    const guideData = await Guide.findById(guide);
    if (!guideData || !guideData.isActive) {
      return res.status(400).json({ message: "Invalid or inactive guide" });
    }

    // Validate members
    if (!members || members.length < 3 || members.length > 4) {
      return res.status(400).json({ message: "Group must have 3-4 members" });
    }

    const group = await Group.create({
      name,
      guide,
      projectTitle,
      projectDescription,
      projectTechnology,
      year,
      members,
    });

    // Update guide's assigned groups
    await Guide.findByIdAndUpdate(guide, {
      $push: { assignedGroups: group._id },
    });

    res.status(201).json({ message: "Group created successfully", group });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT /api/groups/:id - Update group
export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { guide, members, ...updateData } = req.body;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Handle guide change
    if (guide && guide !== group.guide.toString()) {
      const newGuide = await Guide.findById(guide);
      if (!newGuide || !newGuide.isActive) {
        return res.status(400).json({ message: "Invalid or inactive guide" });
      }

      // Remove from old guide
      await Guide.findByIdAndUpdate(group.guide, {
        $pull: { assignedGroups: group._id },
      });
      // Add to new guide
      await Guide.findByIdAndUpdate(guide, {
        $push: { assignedGroups: group._id },
      });
      updateData.guide = guide;
    }

    // Handle member changes
    if (members) {
      if (members.length < 3 || members.length > 4) {
        return res.status(400).json({ message: "Group must have 3-4 members" });
      }
      updateData.members = members;
    }

    const updatedGroup = await Group.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("guide", "name email expertise mobile");

    res.json({ message: "Group updated successfully", group: updatedGroup });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE /api/groups/:id - Delete group
export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findByIdAndDelete(id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Remove from guide's assigned groups
    await Guide.findByIdAndUpdate(group.guide, {
      $pull: { assignedGroups: group._id },
    });

    res.json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAvailableStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const { course, semester, year } = req.query;

    if (!course || !semester || !year) {
      return res.status(400).json({
        message: "Course, semester, and year parameters are required",
      });
    }

    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const numericSemester = parseInt(semester, 10);
    const numericYear = parseInt(year, 10);

    // Find active divisions matching the course, semester, and year
    const divisions = await Division.find({
      course: { $regex: new RegExp(`^${course}`, "i") }, // Case-insensitive partial match
      semester: numericSemester,
      year: numericYear,
      status: "active",
    });

    if (divisions.length === 0) {
      console.log(
        `No divisions found for course: ${course}, semester: ${numericSemester}, year: ${numericYear}`
      );
      return res.status(404).json({ message: "No matching divisions found" });
    }

    const divisionIds = divisions.map((d) => d._id);

    // Get all enrolled students in these divisions who are registered
    const enrollments = await Enrollment.find({
      divisionId: { $in: divisionIds },
      isRegistered: true,
    });

    if (enrollments.length === 0) {
      console.log(`No enrollments found for division IDs: ${divisionIds}`);
      return res
        .status(404)
        .json({ message: "No students enrolled in matching divisions" });
    }

    // Get all existing groups to find assigned enrollments
    const allGroups = await Group.find({}).populate(
      "members",
      "enrollmentNumber"
    );
    const assignedEnrollments = allGroups.flatMap((g) =>
      g.members.map((m) => m.enrollmentNumber)
    );

    // Filter out students already in any group, and exclude current group's members specifically
    const currentGroupEnrollments = group.members.map(
      (m) => m.enrollmentNumber
    );
    const availableStudents = enrollments
      .filter(
        (e) =>
          !assignedEnrollments.includes(e.enrollmentNumber) &&
          !currentGroupEnrollments.includes(e.enrollmentNumber)
      )
      .map((e) => ({
        enrollmentNumber: e.enrollmentNumber,
        name: e.studentName || "Unknown Student",
        className: `${course} ${numericSemester}`,
      }));

    console.log(
      `Found ${availableStudents.length} available students for group ${id}`
    );

    res.json(availableStudents);
  } catch (error) {
    console.error("Error in getAvailableStudents:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
