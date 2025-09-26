import express from "express";
import {
  getAllGuideAnnouncements,
  createGuideAnnouncement,
  updateGuideAnnouncement,
  deleteGuideAnnouncement,
} from "../controllers/guideAnnouncementController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protectAdmin);

// GET /api/guide-announcements
router.get("/", getAllGuideAnnouncements);

// POST /api/guide-announcements
router.post("/", createGuideAnnouncement);

// PUT /api/guide-announcements/:id
router.put("/:id", updateGuideAnnouncement);

// DELETE /api/guide-announcements/:id
router.delete("/:id", deleteGuideAnnouncement);

export default router;
