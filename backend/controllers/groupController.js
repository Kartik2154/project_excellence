import Group from "../models/group.js";
import Guide from "../models/guide.js";
import Student from "../models/student.js";
import Division from "../models/division.js";
import Enrollment from "../models/enrollment.js";

// GET /api/groups - Get all groups with optional filtering
export const getAllGroups = async (req, res) => {
  try {
    const { course, year, guide } = req.query;
    let filter = {};

    if (course) filter["members.className"] = new RegExp(`^${course}`, "i");
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
    const group = await Group.findById(id).populate(
      "guide",
      "name email expertise mobile"
    );

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

// GET /api/groups/:id/students/available - Get available students for a group
export const getAvailableStudents = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Get group's course and semester from first member
    const firstMember = group.members[0];
    if (!firstMember) {
      return res
        .status(400)
        .json({ message: "Group has no members to determine course" });
    }

    const classParts = firstMember.className.split(" ");
    const course = classParts[0];
    const semester = parseInt(classParts[1]);

    // Get all students in matching divisions
    const divisions = await Division.find({
      course,
      semester,
      year: group.year,
      status: "active",
    });
    const divisionIds = divisions.map((d) => d._id);

    // Get all enrolled students in these divisions
    const enrollments = await Enrollment.find({
      divisionId: { $in: divisionIds },
      isRegistered: true,
    });

    // Get students already in groups
    const groups = await Group.find({});
    const assignedEnrollments = groups.flatMap((g) =>
      g.members.map((m) => m.enrollment)
    );

    // Filter available students
    const availableStudents = enrollments
      .filter((e) => !assignedEnrollments.includes(e.enrollmentNumber))
      .map((e) => ({
        enrollmentNumber: e.enrollmentNumber,
        name: e.studentName,
        className: `${course} ${semester}`,
      }));

    res.json(availableStudents);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
