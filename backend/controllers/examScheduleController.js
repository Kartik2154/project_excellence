import ExamSchedule from "../models/examSchedule.js";

// Get all exam schedules with optional course filter
export const getAllSchedules = async (req, res) => {
  try {
    const { course } = req.query;
    const filter = course && course !== "All" ? { course } : {};
    const schedules = await ExamSchedule.find(filter).sort({ date: 1 });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new exam schedule
export const createSchedule = async (req, res) => {
  try {
    const { course, type, description, date, time } = req.body;

    const schedule = await ExamSchedule.create({
      course,
      type,
      description,
      date: new Date(date),
      time: time || "",
    });

    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update exam schedule
export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { course, type, description, date, time } = req.body;

    const schedule = await ExamSchedule.findByIdAndUpdate(
      id,
      {
        course,
        type,
        description,
        date: new Date(date),
        time: time || "",
      },
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete exam schedule
export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await ExamSchedule.findByIdAndDelete(id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
