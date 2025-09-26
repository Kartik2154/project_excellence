import express from "express";
import {
  getAllProjectEvaluations,
  getProjectEvaluations,
  updateProjectEvaluation,
} from "../controllers/projectEvaluationController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protectAdmin, getAllProjectEvaluations);
router.get("/:projectId", protectAdmin, getProjectEvaluations);
router.put("/:projectId/:parameterId", protectAdmin, updateProjectEvaluation);

export default router;
