import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import ArticlePage from './pages/ArticlePage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AddNews from './pages/AddNews';
import EditNews from './pages/EditNews';
import NotFound from './pages/NotFound';
import { Toaster } from 'react-hot-toast';
import { Profile } from './components/Profile';


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AuthOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/article/:id" element={<AuthOnlyRoute><ArticlePage /></AuthOnlyRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/add-news"
              element={
                <ProtectedRoute>
                  <AddNews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-news/:id"
              element={
                <ProtectedRoute>
                  <EditNews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-news"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                
                  <Profile />
                
              }
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;