// backend/src/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import guideRoutes from "./routes/guideRoutes.js";
import groupRoutes from "./routes/groupRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import divisionRoutes from "./routes/divisionRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import evaluationParameterRoutes from "./routes/evaluationParameterRoutes.js";
import projectEvaluationRoutes from "./routes/projectEvaluationRoutes.js";
import examScheduleRoutes from "./routes/examScheduleRoutes.js";
import courseAnnouncementRoutes from "./routes/courseAnnouncementRoutes.js";
import guideAnnouncementRoutes from "./routes/guideAnnouncementRoutes.js";

dotenv.config();
connectDB();

const app = express();

// allow frontend origin
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/divisions", divisionRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/evaluation-parameters", evaluationParameterRoutes);
app.use("/api/project-evaluations", projectEvaluationRoutes);
app.use("/api/exam-schedules", examScheduleRoutes);
app.use("/api/course-announcements", courseAnnouncementRoutes);
app.use("/api/guide-announcements", guideAnnouncementRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
