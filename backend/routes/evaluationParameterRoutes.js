import express from "express";
import {
  getAllEvaluationParameters,
  createEvaluationParameter,
  updateEvaluationParameter,
  deleteEvaluationParameter,
} from "../controllers/evaluationParameterController.js";

const router = express.Router();

// GET /api/evaluation-parameters - Get all evaluation parameters
router.get("/", getAllEvaluationParameters);

// POST /api/evaluation-parameters - Create a new evaluation parameter
router.post("/", createEvaluationParameter);

// PUT /api/evaluation-parameters/:id - Update an evaluation parameter
router.put("/:id", updateEvaluationParameter);

// DELETE /api/evaluation-parameters/:id - Delete an evaluation parameter
router.delete("/:id", deleteEvaluationParameter);

export default router;
