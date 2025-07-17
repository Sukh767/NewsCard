import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onSearch, onCategoryFilter }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const categories = ['Technology', 'Sports', 'Politics', 'Entertainment', 'Health', 'Business'];

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update scrolled state for glassmorphism effect
      setIsScrolled(currentScrollY > 10);
      
      // Hide/show navbar based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up or at top - show navbar
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-white/20 dark:border-gray-700/30 shadow-lg' 
          : 'bg-white dark:bg-gray-900 shadow-md'
      }`}
    >
      {/* Glassmorphism overlay */}
      {isScrolled && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 dark:from-blue-400/10 dark:via-purple-400/10 dark:to-blue-400/10"></div>
      )}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group relative z-10">
            <div className={`text-white px-3 py-2 rounded-md font-bold text-xl transform group-hover:scale-105 transition-all duration-300 ${
              isScrolled 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg shadow-blue-500/25' 
                : 'bg-blue-600 dark:bg-blue-500'
            }`}>
              News
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 relative z-10">
            <Link 
              to="/" 
              className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105 relative ${
                isScrolled ? 'hover:bg-white/10 dark:hover:bg-gray-800/30 px-3 py-2 rounded-lg backdrop-blur-sm' : ''
              }`}
            >
              Home
            </Link>
            
            {/* Category Dropdown */}
            <div className="relative group">
              <button className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ${
                isScrolled ? 'hover:bg-white/10 dark:hover:bg-gray-800/30 px-3 py-2 rounded-lg backdrop-blur-sm' : ''
              }`}>
                Categories
              </button>
              <div className={`absolute top-full left-0 mt-1 w-48 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 ${
                isScrolled 
                  ? 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-white/20 dark:border-gray-700/30' 
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}>
                <div className="py-2">
                  <button
                    onClick={() => onCategoryFilter?.('')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 backdrop-blur-sm"
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => onCategoryFilter?.(category)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200 backdrop-blur-sm"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search news..."
                  className={`w-64 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-300 ${
                    isScrolled 
                      ? 'bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border border-white/30 dark:border-gray-600/30 placeholder-gray-600 dark:placeholder-gray-400' 
                      : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
                  }`}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
            </form>

            {/* Theme Toggle */}
            <div className={`${isScrolled ? 'backdrop-blur-sm' : ''}`}>
              <ThemeToggle />
            </div>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Welcome, {user?.username}</span>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      isScrolled 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 backdrop-blur-sm' 
                        : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
                    }`}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 ${
                    isScrolled ? 'hover:bg-red-50/20 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg backdrop-blur-sm' : ''
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ${
                    isScrolled ? 'hover:bg-white/10 dark:hover:bg-gray-800/30 px-3 py-2 rounded-lg backdrop-blur-sm' : ''
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className={`flex items-center space-x-1 text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25 backdrop-blur-sm' 
                      : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 relative z-10 ${
              isScrolled ? 'hover:bg-white/10 dark:hover:bg-gray-800/30 backdrop-blur-sm' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className={`md:hidden border-t transition-all duration-300 animate-slideDown ${
          isScrolled 
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-white/20 dark:border-gray-700/30' 
            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-300 ${
                isScrolled ? 'hover:bg-white/20 dark:hover:bg-gray-800/30 backdrop-blur-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-3 py-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search news..."
                  className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all duration-300 ${
                    isScrolled 
                      ? 'bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border border-white/30 dark:border-gray-600/30' 
                      : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
                  }`}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
            </form>

            {/* Mobile Categories */}
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Categories</p>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    onCategoryFilter?.('');
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-3 py-1 text-sm text-gray-700 dark:text-gray-300 rounded-md transition-all duration-200 ${
                    isScrolled ? 'hover:bg-white/20 dark:hover:bg-gray-800/30 backdrop-blur-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      onCategoryFilter?.(category);
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-1 text-sm text-gray-700 dark:text-gray-300 rounded-md transition-all duration-200 ${
                      isScrolled ? 'hover:bg-white/20 dark:hover:bg-gray-800/30 backdrop-blur-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Theme Toggle */}
            <div className="px-3 py-2">
              <ThemeToggle />
            </div>

            {/* Mobile Auth */}
            {isAuthenticated ? (
              <div className={`px-3 py-2 border-t space-y-2 ${
                isScrolled ? 'border-white/20 dark:border-gray-700/30' : 'border-gray-200 dark:border-gray-700'
              }`}>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Welcome, {user?.username}</p>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`block w-full text-center text-white px-4 py-2 rounded-lg transition-all duration-300 ${
                      isScrolled 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25' 
                        : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-center text-red-600 dark:text-red-400 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isScrolled ? 'hover:bg-red-50/20 dark:hover:bg-red-900/20 backdrop-blur-sm' : 'hover:bg-red-50 dark:hover:bg-red-900/20'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className={`px-3 py-2 border-t space-y-2 ${
                isScrolled ? 'border-white/20 dark:border-gray-700/30' : 'border-gray-200 dark:border-gray-700'
              }`}>
                <Link
                  to="/login"
                  className={`block w-full text-center text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isScrolled ? 'hover:bg-white/20 dark:hover:bg-gray-800/30 backdrop-blur-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`block w-full text-center text-white px-4 py-2 rounded-lg transition-all duration-300 ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25' 
                      : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;