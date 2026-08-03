import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import repoRoutes from "./routes/repoRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import minigitRoutes from "./routes/minigitRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // required so the httpOnly refresh-token cookie is sent/received
  })
);
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.get("/api/health", (req, res) => res.json({ success: true, message: "Repofy API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/repos", repoRoutes);
app.use("/api/repos/:repoId/files", fileRoutes);
app.use("/api/repos/:repoId/minigit", minigitRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Repofy backend running on port ${PORT}`));
});
