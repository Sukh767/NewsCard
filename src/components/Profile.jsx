import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../utils/api";
import { Home, User, Mail, UserCheck, Save, Camera, Edit, Lock, Eye, EyeOff } from "lucide-react";

export const Profile = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    // lastName: "",
    email: "",
    username: "",
    avatar: null,
    password: "",
    confirmPassword: ""
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [originalData, setOriginalData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const userId = JSON.parse(localStorage.getItem('user'))?._id;

  // Password validation regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

  // Validate password
  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one digit");
    }
    if (!/(?=.*[@$!%*?#&])/.test(password)) {
      errors.push("Password must contain at least one special character (@$!%*?#&)");
    }
    
    return errors;
  };

  // Fetch profile details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getProfile();
        console.log("Profile page", response);
        
        // Check if response contains user data
        if (response && response.user) {
          const userData = response.user;
          
          const profileData = {
            username: userData.username || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            // username: userData.username || "",
            avatar: null,
            password: "",
            confirmPassword: ""
          };
          
          setFormData(profileData);
          setOriginalData(profileData);
          
          // Set profile picture if available
          if (userData.avatarUrl) {
            setPreview(userData.avatarUrl);
          } else if (userData.avatar) {
            setPreview(userData.avatar);
          }
        } else {
          toast.error("Failed to load profile data");
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "password") {
      const errors = validatePassword(value);
      setPasswordErrors(errors);
      
      // Check if confirm password matches
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        if (!passwordErrors.includes("Passwords do not match")) {
          setPasswordErrors(prev => [...prev, "Passwords do not match"]);
        }
      } else {
        setPasswordErrors(prev => prev.filter(error => error !== "Passwords do not match"));
      }
    }
    
    if (name === "confirmPassword" && formData.password) {
      if (value !== formData.password) {
        if (!passwordErrors.includes("Passwords do not match")) {
          setPasswordErrors(prev => [...prev, "Passwords do not match"]);
        }
      } else {
        setPasswordErrors(prev => prev.filter(error => error !== "Passwords do not match"));
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      setFormData((prev) => ({ ...prev, avatar: file }));
      setPreview(URL.createObjectURL(file));
    }
  };


// Update profile
const handleUpdate = async (e) => {
  e.preventDefault();

  // Validate passwords if they are being changed
  if (formData.password) {
    const errors = validatePassword(formData.password);
    
    if (errors.length > 0) {
      setPasswordErrors(errors);
      toast.error("Please fix password validation errors");
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setPasswordErrors(["Passwords do not match"]);
      toast.error("Passwords do not match");
      return;
    }
  }

  try {
    setLoading(true);

    const data = new FormData();
    
    // Only append fields that have changed
    if (formData.username !== originalData.username) {
      data.append("username", formData.username);
    }
    if (formData.lastName !== originalData.lastName) {
      data.append("lastName", formData.lastName);
    }
    if (formData.email !== originalData.email) {
      data.append("email", formData.email);
    }
    if (formData.avatar) {
      data.append("avatar", formData.avatar);
    }
    // Only append password if it's been changed
    if (formData.password) {
      data.append("password", formData.password);
    }

    console.log("FormData contents:");
    for (let [key, value] of data.entries()) {
      console.log(key, value);
    }

    // Check if there are any changes
    let hasChanges = false;
    for (let entry of data.entries()) {
      hasChanges = true;
      break;
    }

    if (!hasChanges) {
      toast.error("No changes to save");
      setIsEditing(false);
      return;
    }

    const res = await authAPI.updateProfile(data);
    console.log("Update response:", res);

    if (res && res.user) {
      // Update user in localStorage
      localStorage.setItem("user", JSON.stringify(res.user));
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      
      // Update original data with new values
      setOriginalData({
        ...formData,
        avatar: null, // Reset avatar as it's now uploaded
        password: "", // Clear password fields
        confirmPassword: ""
      });
      
      // Clear password fields in form data
      setFormData(prev => ({
        ...prev,
        password: "",
        confirmPassword: ""
      }));
      
      setPasswordErrors([]);
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (error) {
    console.error("Update error details:", error);
    
    if (error.response) {
      if (error.response.status === 500) {
        toast.error("Server error. Please check the console for details.");
      } else {
        toast.error(error.response.data?.error || `Error: ${error.response.status}`);
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error(error.message || "Profile update failed");
    }
  } finally {
    setLoading(false);
  }
};

  const changeEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reload original data from server
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authAPI.getProfile();
        
        if (response && response.user) {
          const userData = response.user;
          const profileData = {
            username: userData.username || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            // username: userData.username || "",
            avatar: null,
            password: "",
            confirmPassword: ""
          };
          
          setFormData(profileData);
          setOriginalData(profileData);
          
          if (userData.avatarUrl) {
            setPreview(userData.avatarUrl);
          } else if (userData.avatar) {
            setPreview(userData.avatar);
          }
          
          setIsEditing(false);
          setPasswordErrors([]);
        } else {
          toast.error("Failed to reload profile data");
        }
      } catch (error) {
        toast.error("Failed to reload profile data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">Profile</span>
        </nav>

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
            {!isEditing && (
              <button
                onClick={changeEdit}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and update your personal information.
          </p>
        </div>

        {/* Profile Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Profile Photo
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  JPG, GIF or PNG. Max size of 5MB.
                </p>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  User Name
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Last Name */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div> */}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={true}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  username
                </label>
                <div className="relative">
                  <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Password */}
              {isEditing && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Password Validation Errors */}
            {passwordErrors.length > 0 && isEditing && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                  Password Requirements:
                </h4>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  {passwordErrors.map((error, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-red-500 mr-2">•</span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex items-center space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? "Saving..." : "Save Changes"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};