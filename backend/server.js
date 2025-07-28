import dotenv from "dotenv";
import connectDB from "./config/db.js";
import express from "express";
import authRoutes from './routes/auth.js';
// initials
dotenv.config();
const app = express();
const port = 5000;

// Executions
connectDB();

app.use('/api/admin/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
