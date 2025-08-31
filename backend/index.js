// backend/src/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import guideRoutes from "./routes/guideRoutes.js";
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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
