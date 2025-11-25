import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoutes from "./routes/analyzeRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Base Route
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

// API Routes
app.use("/api", analyzeRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

