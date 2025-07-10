import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, Newspaper, TrendingUp, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
      {/* Left Side - News Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)'
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-purple-900/90"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          {/* Logo */}
          <div className="mb-8 animate-fadeInLeft">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-white text-blue-600 px-4 py-3 rounded-lg font-bold text-2xl transform hover:scale-105 transition-transform duration-300">
                News
              </div>
              <span className="text-3xl font-bold">Hub</span>
            </div>
            <div className="w-16 h-1 bg-white rounded-full"></div>
          </div>

          {/* Headlines */}
          <div className="space-y-6 animate-fadeInLeft animation-delay-200">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Stay Informed,
              <br />
              <span className="text-blue-300">Stay Ahead</span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed max-w-md">
              Access breaking news, in-depth analysis, and trusted journalism from around the world.
            </p>
          </div>

          {/* Features */}
          <div className="mt-12 space-y-4 animate-fadeInLeft animation-delay-400">
            <div className="flex items-center space-x-3 text-blue-100">
              <div className="bg-blue-500/30 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span>Real-time breaking news updates</span>
            </div>
            <div className="flex items-center space-x-3 text-blue-100">
              <div className="bg-blue-500/30 p-2 rounded-lg">
                <Globe className="h-5 w-5" />
              </div>
              <span>Global coverage from trusted sources</span>
            </div>
            <div className="flex items-center space-x-3 text-blue-100">
              <div className="bg-blue-500/30 p-2 rounded-lg">
                <Newspaper className="h-5 w-5" />
              </div>
              <span>Personalized news experience</span>
            </div>
          </div>

          {/* Floating News Cards */}
          <div className="absolute top-20 right-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-xs animate-bounce animation-delay-1000">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">BREAKING</span>
            </div>
            <p className="text-white/90 text-sm mt-2">Latest updates from around the world...</p>
          </div>

          <div className="absolute bottom-32 right-16 bg-white/10 backdrop-blur-sm rounded-lg p-3 animate-fadeInUp animation-delay-1200">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-white text-sm font-medium">Trending Now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full animate-fadeInUp">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors group">
              <div className="bg-blue-600 dark:bg-blue-500 text-white px-3 py-2 rounded-md font-bold text-xl transform group-hover:scale-105 transition-transform duration-300">
                News
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Hub</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left mb-8 animate-fadeInUp animation-delay-200">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Sign in to access your personalized news dashboard
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-colors duration-300 animate-fadeInUp animation-delay-400">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 animate-shake">
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    {error}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 group-hover:border-blue-300 dark:group-hover:border-blue-500"
                      placeholder="Enter your username"
                      required
                    />
                    <User className="absolute left-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 group-hover:border-blue-300 dark:group-hover:border-blue-500"
                      placeholder="Enter your password"
                      required
                    />
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors duration-300" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors duration-300"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-700 dark:from-purple-500 dark:to-blue-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none font-semibold text-lg flex items-center justify-center space-x-2 group"
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                {!loading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />}
              </button>
            </form>

            {/* Links */}
            <div className="mt-8 space-y-4">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors duration-300"
                  >
                    Create one now
                  </Link>
                </p>
              </div>
              
              <div className="text-center">
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-300 group"
                >
                  <span>← Back to NewsHub</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 animate-fadeInUp animation-delay-600">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                Demo Admin Access
              </h3>
            </div>
            <div className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
              <p><span className="font-medium">Username:</span> <code className="bg-yellow-100 dark:bg-yellow-800/30 px-2 py-1 rounded">tonystark</code></p>
              <p><span className="font-medium">Password:</span> <code className="bg-yellow-100 dark:bg-yellow-800/30 px-2 py-1 rounded">Tony@123</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;