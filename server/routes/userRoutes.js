import express from 'express';
import auth from '../middleware/auth.js'
import { getAllUsers, getUserProfile, loginUser, logoutUser, registerUser, updateProfile } from '../controller/userController.js';
import { upload } from '../config/multerConfig.js';


const router = express.Router();

// @route   POST /api/users/profile
// @desc    Update user details
// @access  Private
router.put('/update', auth, upload.single('avatar'), updateProfile);

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/users/login
// @desc    Login user or admin
// @access  Public
router.post('/login', loginUser);

// @route   POST /api/users/logout
// @desc    Logout user (clear token)
// @access  Private
router.post('/logout', auth, logoutUser);

// @route   GET /api/users/profile
// @desc    Get logged-in user's profile
// @access  Private
router.get('/profile', auth, getUserProfile);

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private/Admin
router.get('/', auth, getAllUsers);

export default router;