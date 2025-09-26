import GuideAnnouncement from "../models/guideAnnouncement.js";

// Get all guide announcements
export const getAllGuideAnnouncements = async (req, res) => {
  try {
    const announcements = await GuideAnnouncement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new guide announcement
export const createGuideAnnouncement = async (req, res) => {
  try {
    const { title, message, date, guides } = req.body;

    const announcement = await GuideAnnouncement.create({
      title,
      message,
      date: new Date(date),
      guides,
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update guide announcement
export const updateGuideAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, date, guides } = req.body;

    const announcement = await GuideAnnouncement.findByIdAndUpdate(
      id,
      {
        title,
        message,
        date: new Date(date),
        guides,
      },
      { new: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete guide announcement
export const deleteGuideAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await GuideAnnouncement.findByIdAndDelete(id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
