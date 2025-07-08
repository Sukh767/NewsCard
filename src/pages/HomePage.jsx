import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Star } from 'lucide-react';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import { newsAPI } from '../utils/api';

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadArticles();
  }, [selectedCategory, searchTerm]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await newsAPI.getAllNews(selectedCategory, searchTerm);
      setArticles(data.news);
    } catch (err) {
      setError('Failed to load articles');
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };

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
    </div>
  );
};

export default HomePage;