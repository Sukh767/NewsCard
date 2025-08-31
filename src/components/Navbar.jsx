import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogOut, UserPlus, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onSearch, onCategoryFilter }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsProfileMenuOpen(false);
      setIsCategoryMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  // Function to get user initials for avatar
  const getUserInitials = () => {
    if (!user?.username) return 'U';
    return user.username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/30 dark:border-gray-700/30 shadow-lg' 
          : 'bg-white dark:bg-gray-900 shadow-md'
      }`}
    >
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
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 relative z-10">
            <Link 
              to="/" 
              className={`text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 relative px-3 py-2 rounded-lg ${
                isScrolled ? 'hover:bg-white/10 dark:hover:bg-gray-800/30' : ''
              }`}
            >
              Home
            </Link>
            
            {/* Category Dropdown */}
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCategoryMenuOpen(!isCategoryMenuOpen);
                }}
                className={`flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 px-3 py-2 rounded-lg ${
                  isScrolled ? 'hover:bg-white/10 dark:hover:bg-gray-800/30' : ''
                }`}
              >
                Categories
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCategoryMenuOpen && (
                <div className={`absolute top-full left-0 mt-1 w-48 rounded-xl shadow-xl ${
                  isScrolled 
                    ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/30 dark:border-gray-700/30' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        onCategoryFilter?.('');
                        setIsCategoryMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          onCategoryFilter?.(category);
                          setIsCategoryMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search news..."
                  className={`w-48 lg:w-64 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white transition-all duration-300 ${
                    isScrolled 
                      ? 'bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border border-gray-200/30 dark:border-gray-600/30 placeholder-gray-600 dark:placeholder-gray-400' 
                      : 'bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400'
                  }`}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
            </form>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      isScrolled 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25' 
                        : 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600'
                    }`}
                  >
                    Admin Panel
                  </Link>
                )}
                
                {/* User Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileMenuOpen(!isProfileMenuOpen);
                    }}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                      {getUserInitials()}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium hidden lg:block">
                      {user?.username}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl py-1 ${
                      isScrolled 
                        ? 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200/30 dark:border-gray-700/30' 
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}>
                      <div className="px-4 py-2 border-b border-gray-200/30 dark:border-gray-700/30">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Signed in as</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{user?.username}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 px-3 py-2 rounded-lg ${
                    isScrolled ? 'hover:bg-white/10 dark:hover:bg-gray-800/30' : ''
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className={`flex items-center space-x-1 text-white px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    isScrolled 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25' 
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
          <div className="flex items-center md:hidden space-x-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => {
                setSearchTerm('');
                setIsMenuOpen(false);
                document.getElementById('mobile-search-input')?.focus();
              }}
              className={`p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ${
                isScrolled ? 'hover:bg-white/10 dark:hover:bg-gray-800/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Mobile Theme Toggle */}
            <div className="md:hidden">
              <ThemeToggle />
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ${
                isScrolled ? 'hover:bg-white/10 dark:hover:bg-gray-800/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar (always visible when scrolled) */}
      <div className={`md:hidden px-4 pb-3 transition-all duration-300 ${isScrolled ? 'block' : 'hidden'}`}>
        <form onSubmit={handleSearch} className="relative">
          <input
            id="mobile-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search news..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border border-gray-200/30 dark:border-gray-600/30 placeholder-gray-600 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
        </form>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } ${isScrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md' : 'bg-white dark:bg-gray-900'}`}>
        <div className="px-2 pt-2 pb-4 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-all duration-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          
          {/* Mobile Categories */}
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Categories</p>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onCategoryFilter?.('');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-1 text-sm text-gray-700 dark:text-gray-300 rounded-md transition-all duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
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
                  className="block w-full text-left px-3 py-1 text-sm text-gray-700 dark:text-gray-300 rounded-md transition-all duration-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Auth */}
          {isAuthenticated ? (
            <div className="px-3 py-2 border-t border-gray-200/30 dark:border-gray-700/30 space-y-2">
              <div className="flex items-center space-x-3 py-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                  {getUserInitials()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Welcome, {user?.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
              </div>
              
              <Link
                to="/profile"
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                onClick={() => setIsMenuOpen(false)}
              >
                Your Profile
              </Link>
              
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block w-full text-center text-white px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 transition-all duration-300 mb-2"
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
                className="block w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg transition-all duration-300 hover:bg-red-50/50 dark:hover:bg-red-900/20 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="px-3 py-2 border-t border-gray-200/30 dark:border-gray-700/30 space-y-2">
              <Link
                to="/login"
                className="block w-full text-center text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 flex items-center justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Link>
              <Link
                to="/register"
                className="block w-full text-center text-white px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 transition-all duration-300 flex items-center justify-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;