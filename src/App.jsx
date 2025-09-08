// App.jsx
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
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) return <h1>Loading...</h1>; // or a spinner component <Loading />
  if (!isAuthenticated || !isAdmin) return <Navigate to="/" replace />;
  return children;
};

const AuthOnlyRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <h1>Loading...</h1>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};


const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<HomePage />} />
    <Route path="/article/:id" element={<AuthOnlyRoute><ArticlePage /></AuthOnlyRoute>} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Protected Admin Routes */}
    <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/add-news" element={<ProtectedRoute><AddNews /></ProtectedRoute>} />
    <Route path="/admin/edit-news/:id" element={<ProtectedRoute><EditNews /></ProtectedRoute>} />
    <Route path="/admin/edit-news" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

    <Route path="/profile" element={<AuthOnlyRoute><Profile /></AuthOnlyRoute>} />

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  return (
    <ThemeProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
