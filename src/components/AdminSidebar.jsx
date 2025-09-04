import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, Edit, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const menuItems = [
    { path: '/admin', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/add-news', icon: Plus, label: 'Add News' },
    { path: '/admin/edit-news', icon: Edit, label: 'Edit News' },
    { path: '/', icon: Home, label: 'View Site' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${process.env.REACT_APP_API_URL}/api/users/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <div className="bg-gray-900 dark:bg-gray-950 text-white w-64 min-h-screen flex flex-col transition-colors duration-300">
      <div className="p-6 border-b border-gray-700 dark:border-gray-800">
        <h2 className="text-xl font-bold animate-fadeInLeft">Admin Panel</h2>
        <p className="text-gray-400 text-sm mt-1 animate-fadeInLeft animation-delay-200">
          NewsHub Management
        </p>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li
              key={item.path}
              className="animate-fadeInLeft"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
            >
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
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
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300 transform hover:scale-105"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
