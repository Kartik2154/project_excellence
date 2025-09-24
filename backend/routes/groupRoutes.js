import express from "express";
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  getAvailableStudents,
} from "../controllers/groupController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require admin authentication
router.use(protectAdmin);

// GET /api/groups - Get all groups with optional filtering
router.get("/", getAllGroups);

// GET /api/groups/:id - Get specific group details
router.get("/:id", getGroupById);

// GET /api/groups/:id/students/available - Get available students for a group
router.get("/:id/students/available", getAvailableStudents);

// POST /api/groups - Create new group
router.post("/", createGroup);

// PUT /api/groups/:id - Update group
router.put("/:id", updateGroup);

// DELETE /api/groups/:id - Delete group
router.delete("/:id", deleteGroup);

export default router;
