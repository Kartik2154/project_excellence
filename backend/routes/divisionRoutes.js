import express from "express";
import { getAllDivisions } from "../controllers/divisionController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(protectAdmin);

router.get("/", getAllDivisions);

export default router;
