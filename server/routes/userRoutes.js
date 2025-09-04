import express from "express";
import auth from "../middleware/auth.js";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  getAllUsers,
  createUser,
  deleteUser,
  logoutUser,
} from "../controllers/userController.js";

const router = express.Router();

// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access denied: Admin only" });
  }
  next();
};

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", auth, logoutUser);

// Profile routes
router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateProfile);

// Admin-only routes
router.get("/", auth, adminOnly, getAllUsers);
router.post("/", auth, adminOnly, createUser);
router.delete("/:id", auth, adminOnly, deleteUser);

export default router;