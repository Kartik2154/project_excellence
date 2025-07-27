import dotenv from "dotenv";
import connectDB from "./config/db.js";
import express from "express";

// initials
dotenv.config();
const app = express();
const port = 5000;

// Executions
connectDB();

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
