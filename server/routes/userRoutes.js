import express from "express";
import { authRole, verifyJWT } from "../middleware/auth.js";
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
router.post("/logout", verifyJWT, logoutUser);

// Profile routes
router.get("/profile", verifyJWT, getUserProfile);
router.put("/update", verifyJWT, updateProfile);

// Admin-only routes
router.get("/", verifyJWT, authRole, getAllUsers);
router.post("/", verifyJWT, authRole, createUser);
router.delete("/:id", verifyJWT, authRole, deleteUser);

export default router;