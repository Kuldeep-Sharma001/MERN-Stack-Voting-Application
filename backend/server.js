import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import { jwtAuthMiddleware } from "./jwt.js";
import Candidate from "./models/candidate.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/user", userRoutes);

app.use("/candidate", jwtAuthMiddleware, candidateRoutes);

//GET ALL CANDIDATES (PUBLIC ROUTE)
app.get("/all-candidates", async (req, res) => {
  try {
    const candidates = await Candidate.find(
      {},
      "name party voteCount _id",
    ).sort({ voteCount: -1 });
    res.status(200).json({
      success: true,
      message: "Data fetched",
      candidates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
