import express from "express";
import { getAllEnrollments } from "../controllers/enrollmentController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protectAdmin);

// GET /api/enrollments - Get all enrollments
router.get("/", getAllEnrollments);

export default router;
