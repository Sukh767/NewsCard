import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Mail, Check, X, ArrowRight, Users, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: '',
    color: ''
  });
  const [passwordChecks, setPasswordChecks] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasDigit: false,
    hasSpecialChar: false
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  // Password validation function
  const validatePassword = (password) => {
    const checks = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasDigit: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    let strength = { score: 0, label: 'Very Weak', color: 'bg-red-500' };

    if (passedChecks === 0) {
      strength = { score: 0, label: 'Very Weak', color: 'bg-red-500' };
    } else if (passedChecks === 1) {
      strength = { score: 20, label: 'Weak', color: 'bg-red-400' };
    } else if (passedChecks === 2) {
      strength = { score: 40, label: 'Fair', color: 'bg-orange-400' };
    } else if (passedChecks === 3) {
      strength = { score: 60, label: 'Good', color: 'bg-yellow-400' };
    } else if (passedChecks === 4) {
      strength = { score: 80, label: 'Strong', color: 'bg-blue-500' };
    } else if (passedChecks === 5) {
      strength = { score: 100, label: 'Very Strong', color: 'bg-green-500' };
    }

    return { checks, strength };
  };

  useEffect(() => {
    if (formData.password) {
      const { checks, strength } = validatePassword(formData.password);
      setPasswordChecks(checks);
      setPasswordStrength(strength);
    } else {
      setPasswordChecks({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasDigit: false,
        hasSpecialChar: false
      });
      setPasswordStrength({ score: 0, label: '', color: '' });
    }
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isPasswordValid = () => {
    return Object.values(passwordChecks).every(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isPasswordValid()) {
      setError('Password does not meet all requirements');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const success = await register(formData.username, formData.email, formData.password);
      if (success) {
        navigate('/');
      } else {
        setError('Registration failed. Username or email may already exist.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const PolicyCheck = ({ isValid, text }) => (
    <div className={`flex items-center space-x-2 text-sm transition-all duration-300 ${
      isValid ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'
    }`}>
      <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
        isValid ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'
      }`}>
        {isValid ? (
          <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
        ) : (
          <X className="h-3 w-3 text-gray-400 dark:text-gray-500" />
        )}
      </div>
      <span className={`transition-all duration-300 ${isValid ? 'line-through opacity-75' : ''}`}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
      {/* Left Side - Community & Benefits */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)'
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-blue-800/80 to-indigo-900/90"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          {/* Logo */}
          <div className="mb-8 animate-fadeInLeft">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-white text-purple-600 px-4 py-3 rounded-lg font-bold text-2xl transform hover:scale-105 transition-transform duration-300">
                News
              </div>
              <span className="text-3xl font-bold">Hub</span>
            </div>
            <div className="w-16 h-1 bg-white rounded-full"></div>
          </div>

          {/* Headlines */}
          <div className="space-y-6 animate-fadeInLeft animation-delay-200">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Join the
              <br />
              <span className="text-purple-300">NewsHub Community</span>
            </h1>
            <p className="text-xl text-purple-100 leading-relaxed max-w-md">
              Connect with millions of readers and stay informed with personalized news experiences.
            </p>
          </div>

          {/* Benefits */}
          <div className="mt-12 space-y-4 animate-fadeInLeft animation-delay-400">
            <div className="flex items-center space-x-3 text-purple-100">
              <div className="bg-purple-500/30 p-2 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <span>Join 2M+ active readers worldwide</span>
            </div>
            <div className="flex items-center space-x-3 text-purple-100">
              <div className="bg-purple-500/30 p-2 rounded-lg">
                <Shield className="h-5 w-5" />
              </div>
              <span>Secure and privacy-focused platform</span>
            </div>
            <div className="flex items-center space-x-3 text-purple-100">
              <div className="bg-purple-500/30 p-2 rounded-lg">
                <Zap className="h-5 w-5" />
              </div>
              <span>Personalized news recommendations</span>
            </div>
          </div>

          {/* Floating Community Stats */}
          <div className="absolute top-20 right-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-xs animate-bounce animation-delay-1000">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">LIVE</span>
            </div>
            <p className="text-white/90 text-sm mt-2">2,847 readers online now</p>
          </div>

          <div className="absolute bottom-32 right-16 bg-white/10 backdrop-blur-sm rounded-lg p-3 animate-fadeInUp animation-delay-1200">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-400" />
              <span className="text-white text-sm font-medium">Growing Community</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
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
              Create Your Account
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Start your personalized news journey today
            </p>
          </div>

          {/* Registration Form */}
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
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 group-hover:border-blue-300 dark:group-hover:border-blue-500"
                      placeholder="Choose a username"
                      required
                    />
                    <User className="absolute left-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 group-hover:border-blue-300 dark:group-hover:border-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                    <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors duration-300" />
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
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 group-hover:border-blue-300 dark:group-hover:border-blue-500"
                      placeholder="Create a strong password"
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

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-3 animate-fadeInUp">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Password Strength:</span>
                        <span className={`text-sm font-semibold ${
                          passwordStrength.score >= 80 ? 'text-green-600 dark:text-green-400' :
                          passwordStrength.score >= 60 ? 'text-blue-600 dark:text-blue-400' :
                          passwordStrength.score >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.score}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Password Policy */}
                  {formData.password && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-xl animate-fadeInUp">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Security Requirements:
                      </h4>
                      <div className="space-y-2">
                        <PolicyCheck 
                          isValid={passwordChecks.minLength} 
                          text="Minimum 8 characters" 
                        />
                        <PolicyCheck 
                          isValid={passwordChecks.hasUppercase} 
                          text="At least one uppercase letter" 
                        />
                        <PolicyCheck 
                          isValid={passwordChecks.hasLowercase} 
                          text="At least one lowercase letter" 
                        />
                        <PolicyCheck 
                          isValid={passwordChecks.hasDigit} 
                          text="At least one digit" 
                        />
                        <PolicyCheck 
                          isValid={passwordChecks.hasSpecialChar} 
                          text="At least one special character (!@#$%^&*)" 
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-12 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword
                          ? 'border-red-300 dark:border-red-600 group-hover:border-red-400'
                          : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-300 dark:group-hover:border-blue-500'
                      }`}
                      placeholder="Confirm your password"
                      required
                    />
                    <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors duration-300" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors duration-300"
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  
                  {formData.confirmPassword && (
                    <div className="mt-2">
                      {formData.password !== formData.confirmPassword ? (
                        <p className="text-sm text-red-600 dark:text-red-400 flex items-center animate-shake">
                          <X className="h-4 w-4 mr-1" />
                          Passwords do not match
                        </p>
                      ) : (
                        <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                          <Check className="h-4 w-4 mr-1" />
                          Passwords match perfectly
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isPasswordValid() || formData.password !== formData.confirmPassword}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-600 dark:hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none font-semibold text-lg flex items-center justify-center space-x-2 group"
              >
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                {!loading && <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />}
              </button>
            </form>

            {/* Links */}
            <div className="mt-8 space-y-4">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-semibold transition-colors duration-300"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
              
              <div className="text-center">
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 text-sm transition-colors duration-300 group"
                >
                  <span>← Back to NewsHub</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Terms Notice */}
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 animate-fadeInUp animation-delay-600">
            <p>
              By creating an account, you agree to our{' '}
              <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;