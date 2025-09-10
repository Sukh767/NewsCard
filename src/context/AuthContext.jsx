// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";
import axios from "axios";

const AuthContext = createContext();

const normalizeResponse = (res) => {
  // Accept either axios response (res.data) or a direct payload
  if (!res) return null;
  if (res.data) return res.data;
  return res;
};

const isLikelyUserObject = (obj) => {
  if (!obj || typeof obj !== "object") return false;
  return !!(obj._id || obj.id || obj.email || obj.username);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restore from localStorage once on app start
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (isLikelyUserObject(parsed)) {
          setUser(parsed);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("user");
        }
      }
    } catch (err) {
      console.error("Auth restore error:", err);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // expose a function to explicitly re-check storage (optional)
  const checkAuthStatus = () => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (isLikelyUserObject(parsed)) {
          setUser(parsed);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("user");
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("checkAuthStatus error:", err);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
    }
  };

  // Login: use authAPI.login (but be tolerant of response shape)
  const login = async (email, password) => {
    try {
      const raw = await authAPI.login(email, password); // may be axios response or payload
      const payload = normalizeResponse(raw);

      // payload might be: { message, user } or { user } or user object
      const userData = payload?.user ?? payload;

      if (isLikelyUserObject(userData)) {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));

        // persist token if backend returned it
        if (payload?.token) {
          localStorage.setItem("token", payload.token);
        }

        return { success: true, user: userData };
      }

      return { success: false, message: "Invalid server response" };
    } catch (err) {
      console.error("Login failed:", err?.response?.data || err?.message || err);
      return {
        success: false,
        message:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "Login failed",
      };
    }
  };

  // Register: similar normalization (uses authAPI if you have it)
const register = async (payloadData) => {
  try {
    // Use your authAPI.register function
    const raw = await authAPI.register(payloadData);
    const payload = normalizeResponse(raw);
    const userData = payload?.user ?? payload;

    if (isLikelyUserObject(userData)) {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
      if (payload?.token) localStorage.setItem("token", payload.token);
      return true;
    }

    throw new Error("Invalid server response");
  } catch (err) {
    console.error("Register failed:", err?.response?.data || err?.message || err);
    throw new Error(err?.response?.data?.error || err?.message || "Registration failed");
  }
};

  // Logout
  const logout = async () => {
    try {
      if (authAPI.logout) await authAPI.logout();
    } catch (err) {
      console.error("Logout request failed:", err?.response?.data || err?.message || err);
    } finally {
      // Always clear local auth state
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const isAdmin = user?.role === "admin" || user?.isAdmin === true;
  const role = user?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading, // important for route guards
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

export const useAuth = () => useContext(AuthContext);
