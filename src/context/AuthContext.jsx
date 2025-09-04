import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  // Login function (backend returns flat fields, not user object)
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      if (res.data?.token) {
        const normalizedUser = res.data.user || {
          id: res.data._id,
          username: res.data.username,
          email: res.data.email,
          role: res.data.role,
        };
        setUser(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        return { success: true, user: normalizedUser };
      }
      return { success: false, message: "Invalid response from server" };
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  // Register function (backend expects username)
  const register = async (name, email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        username: name,
        email,
        password,
      });

      if (res.data?.user && res.data?.token) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        return { success: true, user: res.data.user };
      }
      return { success: false, message: "Invalid response from server" };
    } catch (err) {
      console.error("Registration failed:", err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth
export const useAuth = () => useContext(AuthContext);
