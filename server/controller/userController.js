import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import bcrypt from "bcryptjs";

dotenv.config();
const JWT_SECRET = 'Signature';

// 🔐 Utility: Generate JWT
const generateToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });


// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, avatar } = req.body;

    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Username, email and password are required' });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    const newUser = new User({
      username,
      email,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      avatar: avatar || null
    });

    await newUser.save();

    const token = generateToken({
      userId: newUser._id,
      username: newUser.username,
      role: newUser.role
    });

    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ error: 'Registration failed' });
  }
};


// @desc    User login (admin or user)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Admin shortcut login
    if (username === 'admin' && password === 'admin123') {
      const token = generateToken({ userId: 'admin', username: 'admin', role: 'admin' });

      return res.json({
        token,
        message: "Login Success",
        user: {
          _id: 'admin',
          username: 'admin',
          email: 'admin@newshub.com',
          role: 'admin',
          firstName: 'Super',
          lastName: 'Admin',
          avatar: null
        }
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      userId: user._id,
      username: user.username,
      role: user.role
    });

    res.json({
      token,
      message: "Login Success",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
};


// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};


// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
const logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: 'Logout successful. Please clear the token on client side.' });
  } catch (error) {
    console.error('Logout error:', error.message);
    res.status(500).json({ error: 'Logout failed' });
  }
};

// @desc    Logout user
// @route   POST /api/users/profile
// @access  Private
// const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.userId; // ⚡ fix: req.user.userId not req.user.id
//     const { firstName, lastName, username } = req.body;

//     // Build update object dynamically
//     const updateData = {};
//     if (firstName) updateData.firstName = firstName;
//     if (lastName) updateData.lastName = lastName;
//     if (username) updateData.username = username;

//     // If profile picture uploaded, handle file update
//     if (req.file) {
//       const avatarPath = `/uploads/${req.file.filename}`;
//       updateData.avatar = avatarPath;

//       // Delete old avatar if exists
//       const user = await User.findById(userId);
//       if (user?.avatar) {
//         const oldPath = path.join(process.cwd(), user.avatar.replace('/uploads', 'uploads'));
//         if (fs.existsSync(oldPath)) {
//           fs.unlinkSync(oldPath);
//         }
//       }
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     ).select('-password');

//     res.json({
//       success: true,
//       message: 'Profile updated successfully',
//       user: updatedUser
//     });
//   } catch (err) {
//     console.error('Profile update error:', err);

//     if (err.name === 'ValidationError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: err.errors
//       });
//     }

//     if (err.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: 'Username already exists'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Server error during profile update'
//     });
//   }
// };

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, username, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (username) user.username = username;

    // 🔐 Handle password update
    if (password) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          success: false,
          message:
            'Password must be at least 8 characters long and contain at least 1 uppercase, 1 lowercase, 1 digit, and 1 special character',
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Avatar upload
    if (req.file) {
      const avatarPath = `/uploads/${req.file.filename}`;

      if (user.avatar) {
        const oldPath = path.join(__dirname, '..', user.avatar.replace(/^\//, ''));
        if (fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (unlinkErr) {
            console.error('Error deleting old avatar:', unlinkErr.message);
          }
        }
      }

      user.avatar = avatarPath;
    }

    const updatedUser = await user.save();

    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: userResponse,
    });
  } catch (err) {
    console.error('Profile update error:', err.stack || err.message);
    return res.status(500).json({
      success: false,
      message: 'Server error during profile update',
      error: err.message,
    });
  }
};



const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        avatar: user.avatar, // This will be the path like '/uploads/avatar-123456789.jpg'
        avatarUrl: user.avatar ? `${req.protocol}://${req.get('host')}${user.avatar}` : null,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching profile' 
    });
  }
};



// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admin only' });
    }

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};


export {
  registerUser,
  loginUser,
  getUserProfile,
  logoutUser,
  getAllUsers,
  updateProfile
};

