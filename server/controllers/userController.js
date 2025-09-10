import { uploadOnCloudinary } from "../middleware/uploadCloudinary.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ====================== LOGIN ======================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(email,password)
    // 🔹 Find user
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 🔹 Generate JWT token
    const token = generateToken(user._id, user.role);

    // 🔹 Send token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use secure only in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // 🔹 Return response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// Add a logout function that clears the cookie
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",   // 🔹 Add this (must match login cookie path)
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ error: "Failed to log out user" });
  }
};



// ====================== REGISTER ======================
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, avatar, role, isAdmin } = req.body;

    // Validate required fields
    if (!email || !password || !username) {
      return res.status(400).json({ error: "Email, username, and password are required." });
    }

    // Check if user already exists by email or username
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: "User already exists with this email." });
      } else {
        return res.status(400).json({ error: "Username is already taken." });
      }
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      firstName: firstName || '',
      lastName: lastName || '',
      avatar: avatar || '',
      role: role || "user",
      isAdmin: isAdmin || false,
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isAdmin: newUser.isAdmin,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        avatar: newUser.avatar,
      },
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ====================== GET PROFILE ======================
export const getUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user?._id).select("-password");

    console.log("controller",user)

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

// ====================== GET ALL USERS ======================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("-password");
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ====================== DELETE USER ======================
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      userId: deletedUser._id,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

// ====================== UPDATE PROFILE ======================
export const updateProfile = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    
    const user = await User.findById(req.user._id);
    console.log("Updating user:", req.user);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Handle avatar upload if file is present
    let avatarUrl = user.avatar; // Keep existing avatar by default
    
    if (req.file) {
      try {
        // Upload to Cloudinary
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
        
        if (cloudinaryResponse && cloudinaryResponse.url) {
          avatarUrl = cloudinaryResponse.url;
          console.log("Avatar uploaded to Cloudinary:", avatarUrl);
        } else {
          console.error("Cloudinary upload failed");
          return res.status(500).json({ error: "Failed to upload avatar" });
        }
      } catch (uploadError) {
        console.error("Error uploading to Cloudinary:", uploadError);
        return res.status(500).json({ error: "Failed to upload avatar" });
      }
    }

    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (avatarUrl) user.avatar = avatarUrl;

    // Only update password if new one is provided
    if (password) {
      user.password = password;
    }

    await user.save();

    const sanitizedUser = user.toObject();
    delete sanitizedUser.password;

    res.status(200).json({
      message: "Profile updated successfully",
      user: sanitizedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
// ====================== LOGOUT ======================
/*export const logoutUser = async (req, res) => {
  try {
    // Client should delete token
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ error: "Failed to log out user" });
  }
};
*/
// ====================== CREATE USER ======================
export const createUser = async (req, res) => {
  try {
    const { username, email, password, role, firstName, lastName, avatar } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      role: role || "user",
      firstName,
      lastName,
      avatar,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
