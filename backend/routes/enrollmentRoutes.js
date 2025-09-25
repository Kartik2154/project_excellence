import express from "express";
import {
  getAllEnrollments,
  getEnrollmentsByDivision,
  createEnrollment,
  generateEnrollments,
  deleteEnrollment,
  deleteAllEnrollmentsByDivision,
} from "../controllers/enrollmentController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protectAdmin);

// GET /api/enrollments - Get all enrollments
router.get("/", getAllEnrollments);

// GET /api/enrollments/division/:divisionId - Get enrollments for a division
router.get("/division/:divisionId", getEnrollmentsByDivision);

// POST /api/enrollments - Create a new enrollment
router.post("/", createEnrollment);

// POST /api/enrollments/generate - Generate enrollments in range
router.post("/generate", generateEnrollments);

// DELETE /api/enrollments/:id - Delete a specific enrollment
router.delete("/:id", deleteEnrollment);

// DELETE /api/enrollments/division/:divisionId - Delete all enrollments for a division
router.delete("/division/:divisionId", deleteAllEnrollmentsByDivision);

export default router;
