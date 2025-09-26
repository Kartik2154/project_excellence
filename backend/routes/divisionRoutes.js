import express from "express";
import {
  getAllDivisions,
  createDivision,
  updateDivisionStatus,
  deleteDivision,
} from "../controllers/divisionController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protectAdmin);

router.get("/", getAllDivisions);
router.post("/", createDivision);
router.patch("/:id/status", updateDivisionStatus);
router.delete("/:id", deleteDivision);

export default router;
