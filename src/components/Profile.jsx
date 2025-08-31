import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../utils/api";
import { Home, User, Mail, UserCheck, Save, Camera, Edit } from "lucide-react";

export const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    avatar: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [originalData, setOriginalData] = useState(null);

  // Fetch profile details
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profile = await authAPI.getProfile();
        console.log("Fetched profile:", profile);
        
        const profileData = {
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          email: profile.email || "",
          username: profile.username || "",
          avatar: null,
        };
        
        setFormData(profileData);
        setOriginalData(profileData);
        
        // Set profile picture if available
        if (profile.avatarUrl) {
          setPreview(profile.avatarUrl);
        } else if (profile.avatar) {
          setPreview(profile.avatar);
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

    try {
      setLoading(true);

      const data = new FormData();
      
      // Only append fields that have changed
      if (formData.firstName !== originalData.firstName) {
        data.append("firstName", formData.firstName);
      }
      if (formData.lastName !== originalData.lastName) {
        data.append("lastName", formData.lastName);
      }
      if (formData.username !== originalData.username) {
        data.append("username", formData.username);
      }
      if (formData.avatar) {
        data.append("avatar", formData.avatar);
      }

      console.log("FormData contents:");
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      // Check if there are any changes
      if (data.entries().next().done) {
        toast.error("No changes to save");
        setIsEditing(false);
        return;
      }

      const res = await authAPI.updateProfile(data);
      console.log("Update response:", res);

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      
      // Update original data with new values
      setOriginalData({
        ...formData,
        avatar: null // Reset avatar as it's now uploaded
      });
    } catch (error) {
      console.error("Update error details:", error);
      
      // More detailed error logging
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
        
        if (error.response.status === 500) {
          toast.error("Server error. Please check the console for details.");
        } else {
          toast.error(error.response.data?.message || `Error: ${error.response.status}`);
        }
      } else if (error.request) {
        console.error("Request details:", error.request);
        toast.error("Network error. Please check your connection.");
      } else {
        console.error("Error message:", error.message);
        toast.error(error.message || "Profile update failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const changeEdit = ()=>{
    setIsEditing(true);
  }

  const handleEditToggle = () => {
      if (isEditing) {
          // If canceling edit, revert to original data
          setFormData(originalData);
          // Also revert the preview if it was changed
          const fetchCurrentProfile = async () => {
              try {
                  const profile = await authAPI.getProfile();
                  if (profile.avatarUrl) {
                      setPreview(profile.avatarUrl);
                    } else if (profile.avatar) {
                        setPreview(profile.avatar);
                    }
                } catch (error) {
                    console.error("Failed to reload profile image");
                }
            };
            fetchCurrentProfile();
        }
        setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    // Reload original data from server
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profile = await authAPI.getProfile();
        const profileData = {
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          email: profile.email || "",
          username: profile.username || "",
          avatar: null,
        };
        
        setFormData(profileData);
        setOriginalData(profileData);
        
        if (profile.avatar) {
          setPreview(profile.avatar);
        } else if (profile.avatar) {
          setPreview(profile.avatar);
        }
        
        setIsEditing(false);
      } catch (error) {
        toast.error("Failed to reload profile data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with Home Button */}
        <div className="flex justify-between items-center mb-6">
          <Link 
            to="/" 
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <UserCheck className="h-8 w-8 mr-2 text-blue-600" />
            My Profile
          </h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {loading && !isEditing && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20">
              <p className="text-blue-600 dark:text-blue-400">Loading...</p>
            </div>
          )}

          <form onSubmit={handleUpdate} className="p-6 space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-32 h-32 object-cover rounded-lg shadow-md border-2 border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600">
                    <User className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors duration-200">
                    <Camera className="h-4 w-4" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      disabled={loading}
                    />
                  </label>
                )}
              </div>
              
              {isEditing && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Click the camera icon to change your profile picture
                </p>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                  placeholder="Enter first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                  placeholder="Enter last name"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                  placeholder="Enter username"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                  <Mail className="h-4 w-4 mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  disabled
                  value={formData.email}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Email cannot be changed
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={changeEdit}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 flex items-center justify-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-green-400 transition-colors duration-200 flex items-center justify-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleEditToggle}
                    disabled={loading}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 disabled:bg-gray-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        </div>

        {/* Debug Info (visible only in development) */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Debug Information
            </h2>
            <div className="text-sm font-mono text-gray-600 dark:text-gray-400 overflow-auto">
              <p>Editing: {isEditing ? 'Yes' : 'No'}</p>
              <p>Loading: {loading ? 'Yes' : 'No'}</p>
              <p>Form Data: {JSON.stringify(formData, null, 2)}</p>
              <p>Original Data: {JSON.stringify(originalData, null, 2)}</p>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Profile;