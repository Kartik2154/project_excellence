// backend/src/routes/adminRoutes.js
import express from "express";
import {
  loginAdmin,
  registerAdmin,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/adminController.js";

const router = express.Router();

// POST /api/admin/login
router.post("/login", loginAdmin);

// POST /api/admin/register (optional for seeding first admin)
router.post("/register", registerAdmin);

// Forgot + Reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Change password
router.post("/change-password", changePassword);

export default router;
