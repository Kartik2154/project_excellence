import express from "express";
import {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/examScheduleController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protectAdmin);

// GET /api/exam-schedules?course=BCA (optional course filter)
router.get("/", getAllSchedules);

// POST /api/exam-schedules
router.post("/", createSchedule);

// PUT /api/exam-schedules/:id
router.put("/:id", updateSchedule);

// DELETE /api/exam-schedules/:id
router.delete("/:id", deleteSchedule);

export default router;
