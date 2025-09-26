import express from "express";
import {
  getAllCourseAnnouncements,
  createCourseAnnouncement,
  updateCourseAnnouncement,
  deleteCourseAnnouncement,
} from "../controllers/courseAnnouncementController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protectAdmin);

// GET /api/course-announcements
router.get("/", getAllCourseAnnouncements);

// POST /api/course-announcements
router.post("/", createCourseAnnouncement);

// PUT /api/course-announcements/:id
router.put("/:id", updateCourseAnnouncement);

// DELETE /api/course-announcements/:id
router.delete("/:id", deleteCourseAnnouncement);

export default router;
