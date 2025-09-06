import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, Edit, BarChart3, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { authAPI } from '../utils/api';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth(); // Make sure setUser is destructured correctly

  const menuItems = [
    { path: '/admin', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/add-news', icon: Plus, label: 'Add News' },
    { path: '/admin/edit-news', icon: Edit, label: 'Edit News' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
    { path: '/', icon: Home, label: 'View Site' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      // Check if setUser function exists
      if (typeof setUser !== 'function') {
        console.error('setUser is not a function');
        // Fallback: clear localStorage and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      const token = localStorage.getItem('token');
      if (token) {
        await authAPI.logout();
      }
    } catch (err) {
      console.error('Logout API call failed:', err);
      // Even if API call fails, we should still clear local storage
    } finally {
      // Always clear storage and reset user state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only call setUser if it's a function
      if (typeof setUser === 'function') {
        setUser(null);
      }
      
      navigate('/login');
    }
  };

  return (
    <div className="bg-gray-900 dark:bg-gray-950 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700 dark:border-gray-800">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <p className="text-gray-400 text-sm mt-1">
          NewsHub Management
        </p>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700 dark:border-gray-800 space-y-4">
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
        
        {/* User info (optional) */}
        {user && (
          <div className="px-4 py-2 text-sm text-gray-400">
            <p>Logged in as: {user.username || user.email}</p>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;