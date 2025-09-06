import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { authAPI } from "../utils/api";

const AuthContext = createContext();

// ✅ Configure axios to always send cookies
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔹 On app load → restore from localStorage
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Error restoring auth state:", err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login
  const login = async (email, password) => {
    try {
      const res = await authAPI.login(email, password);

      if (res?.user) {
        setUser(res.user);
        setIsAuthenticated(true);
        console.log(isAuthenticated)

        // ✅ Persist in localStorage
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("token", res.token);

        return { success: true, user: res.user };
      }
      return { success: false, message: "Invalid server response" };
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      return {
        success: false,
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Login failed",
      };
    }
  };

  // 🔹 Register
  const register = async (name, email, password) => {
    try {
      const res = await axios.post("/users/register", {
        username: name, // ✅ matches schema
        email,
        password,
      });

      if (res.data?.user && res.data?.token) {
        setUser(res.data.user);
        setIsAuthenticated(true);

        // ✅ Persist in localStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);

        return { success: true, user: res.data.user };
      }
      return { success: false, message: "Invalid server response" };
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      return {
        success: false,
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error("Logout failed:", err.response?.data || err.message);
    } finally {
      // ✅ Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Helpers
  const isAdmin = user?.role === "admin" || user?.isAdmin === true;
  const role = user?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated,
        isAdmin,
        role,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);
