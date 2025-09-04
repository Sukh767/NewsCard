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
} from "../controllers/newsController.js";
import multer from "multer";
import cloudinaryStorage from "../middleware/uploadCloudinary.js"; // Import the configured upload middleware
import auth from "../middleware/auth.js";

const router = express.Router();
// const upload = multer({ dest: "uploads/" }); // Remove this line
const upload = multer({ storage: cloudinaryStorage });

// Accept common file field names and normalize to req.file
const acceptImageUpload = [
  (req, res, next) => {
    console.log("Middleware triggered. Request headers:", req.headers);
    console.log("Middleware triggered. Request body:", req.body);
    next();
  },
  upload.any(),
  (req, res, next) => {
    if (Array.isArray(req.files) && req.files.length > 0) {
      const preferredFieldNames = ["image", "file", "avatar", "photo", "picture"];
      let selected = req.files.find(f => preferredFieldNames.includes(f.fieldname));
      if (!selected) {
        selected = req.files[0];
      }
      req.file = selected;
    }
    console.log("Request file:", req.file);
    console.log("Request files:", req.files);
    next();
  }
];

router.get("/", getAllNews);
router.get("/featured", getFeaturedNews);
router.get("/categories", getCategories);
router.get("/:id", getSingleNews);

// Admin-only ingest route
router.post("/ingest", auth, async (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  next();
}, ingestNews);

// For JSON requests, parse body; for multipart, Multer will handle it.
router.post(
  "/",
  express.json(),
  express.urlencoded({ extended: true }),
  ...acceptImageUpload,
  createNews
);
router.put(
  "/:id",
  express.json(),
  express.urlencoded({ extended: true }),
  ...acceptImageUpload,
  updateNews
);
router.delete("/:id", deleteNews);

export default router;