import express from "express";
import {
  getAllStudents,
  getAvailableStudents,
} from "../controllers/studentController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protectAdmin);

router.get("/", getAllStudents);
router.get("/available", getAvailableStudents);

export default router;
