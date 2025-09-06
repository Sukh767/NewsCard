import express from "express";
import {
  getAllNews,
  getFeaturedNews,
  getCategories,
  getSingleNews,
  createNews,
  updateNews,
  deleteNews,
  ingestNews,
  unlikeNews,
  likeNews,
} from "../controllers/newsController.js";
import { authRole, verifyJWT } from "../middleware/auth.js";
import { upload } from "../middleware/multer.middleware.js";

const router = express.Router();

// 🔹 Normalize file handling into req.file
const acceptImageUpload = [
  upload.single("imageUrl"), // 👈 expect `imageUrl` field from frontend
  (req, res, next) => {
    if (!req.file && req.files?.length > 0) {
      // Fallback: take the first uploaded file if not under "imageUrl"
      req.file = req.files[0];
    }
    console.log("Request file:", req.file?.originalname);
    next();
  },
];


// ====================== ROUTES ======================
router.get("/", getAllNews);
router.get("/featured", getFeaturedNews);
router.get("/categories", getCategories);
router.get("/:id", getSingleNews);

router.patch("/:id/like", likeNews);
router.patch("/:id/unlike", unlikeNews);

// 🔹 Admin-only ingest route
router.post(
  "/ingest",
  verifyJWT,
  authRole,
  (req, res, next) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  },
  ingestNews
);

// 🔹 Create news (with optional image upload)
router.post("/", ...acceptImageUpload,verifyJWT,authRole, createNews);

// 🔹 Update news (with optional image upload)
router.put("/:id", ...acceptImageUpload,verifyJWT,authRole, updateNews);

// 🔹 Delete news
router.delete("/:id",verifyJWT,authRole, deleteNews);

export default router;
