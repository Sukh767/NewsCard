import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";
import newsRoutes from "./routes/newsRoute.js";
import userRoutes from "./routes/userRoutes.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ CORS setup
app.use(cors({
  origin: "http://localhost:5173", // React frontend
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Uploads directory
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ✅ Serve static files
app.use("/uploads", express.static(uploadsDir));

// ✅ Multer config
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
    const allowedTypes = ["image/jpeg","image/png","image/gif","image/webp"];
    allowedTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed."));
  },
});

// ✅ Routes
app.use("/api/news", newsRoutes);
app.use("/api/users", userRoutes);

// ✅ Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully 🎉" });
});

// ✅ Error middleware
app.use((error, req, res, next) => {
  console.error("Error caught in index.js:", error.message);
  res.status(500).json({ error: error.message || "Internal server error" });
});

export default app;
