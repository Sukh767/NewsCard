// server.js
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import db from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import newsRoutes from "./routes/newsRoute.js";

dotenv.config();
db();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ CORS setup (important for cookies + frontend requests)
app.use(
  cors({
    // origin: "http://localhost:5173", // React frontend
    origin: "https://newscard-mylv.onrender.com",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Uploads directory
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ✅ Serve static files
app.use("/uploads", express.static(uploadsDir));

// ✅ Multer config (export if needed)
export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    allowedTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."));
  },
});

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`.yellow.bold)
);
