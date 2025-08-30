// backend/src/routes/adminRoutes.js
import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/adminController.js";

const router = express.Router();

// POST /api/admin/login
router.post("/login", loginAdmin);

// POST /api/admin/register (optional for seeding first admin)
router.post("/register", registerAdmin);

export default router;