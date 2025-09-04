import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Star, ArrowRight, Heart, Share, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import { newsAPI } from '../utils/api';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadArticles();
    loadTrendingArticles();
  }, [selectedCategory, searchTerm]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await newsAPI.getAllNews({ category: selectedCategory, search: searchTerm });
      console.log(data);
      setArticles(data.news);
    } catch (err) {
      setError('Failed to load articles');
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingArticles = async () => {
    try {
      setTrendingLoading(true);
      // Simulate trending articles - in a real app, you'd have an API endpoint for this
      const data = await newsAPI.getAllNews({});
      // Filter or sort to get trending articles (by views, likes, date, etc.)
      const trending = data.news
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);
      setTrendingArticles(trending);
    } catch (err) {
      console.error('Error loading trending articles:', err);
    } finally {
      setTrendingLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

  const toCloudinaryUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://res.cloudinary.com/drhfcappf/image/upload/${url}`;
  };

  const TrendingNewsSection = () => (
    <div className="bg-white dark:bg-gray-800 rounded-md p-6 mb-12 animate-fadeInUp">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-red-500" />
          Trending Now
        </h2>
        <button className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
          View all
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      {trendingLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-300 dark:bg-gray-600 h-48 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingArticles.map((article, index) => (
            <div 
              key={article._id} 
              className="group cursor-pointer transform hover:scale-105 transition-transform duration-300"
            >
              <div className="relative overflow-hidden rounded-lg mb-3">
                <img 
                  src={toCloudinaryUrl(article.imageUrl) || '/api/placeholder/300/200'} 
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Trending
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Eye className="h-3 w-3 mr-1" />
                <span>1.2k views</span>
                <span className="mx-2">•</span>
                <span>2 hours ago</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const Footer = () => (
    <footer className="bg-gray-900 dark:bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-white px-3 py-2 rounded-md font-bold text-xl bg-blue-600">
                News
              </div>
              <span className="text-xl font-bold text-white">Hub</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted source for the latest news, trends, and insights from around the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Trending</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Politics</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Technology</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sports</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Technology</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sports</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Entertainment</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Business</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Health</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for daily updates</p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 NewsHub. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar onSearch={handleSearch} onCategoryFilter={handleCategoryFilter} />
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Navbar onSearch={handleSearch} onCategoryFilter={handleCategoryFilter} />
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center animate-fadeInUp">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Something went wrong</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <button
              onClick={loadArticles}
              className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar onSearch={handleSearch} onCategoryFilter={handleCategoryFilter} />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white py-16 animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fadeInUp">
              Stay Informed with NewsHub
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-fadeInUp animation-delay-200">
              Your trusted source for breaking news and in-depth analysis
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm animate-fadeInUp animation-delay-400">
              <div className="flex items-center space-x-2 transform hover:scale-105 transition-transform duration-300">
                <TrendingUp className="h-5 w-5" />
                <span>Trending Stories</span>
              </div>
              <div className="flex items-center space-x-2 transform hover:scale-105 transition-transform duration-300">
                <Clock className="h-5 w-5" />
                <span>Real-time Updates</span>
              </div>
              <div className="flex items-center space-x-2 transform hover:scale-105 transition-transform duration-300">
                <Star className="h-5 w-5" />
                <span>Quality Journalism</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trending News Section */}
        <TrendingNewsSection />

        {/* Filter Header */}
        <div className="mb-8 animate-fadeInUp">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {selectedCategory ? `${selectedCategory} News` : 'Latest News'}
            {searchTerm && (
              <span className="text-blue-600 dark:text-blue-400"> - "{searchTerm}"</span>
            )}
          </h2>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span>{articles.length} articles found</span>
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div key={article._id} style={{ animationDelay: `${index * 100}ms` }}>
                <NewsCard 
                  article={article} 
                  featured={index === 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fadeInUp">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filter criteria'
                : 'No articles have been published yet'
              }
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;