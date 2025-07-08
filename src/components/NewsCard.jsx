import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';

const NewsCard = ({ article, featured = false }) => {
  const categoryColors = {
    Technology: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Sports: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Politics: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Entertainment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    Health: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Business: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Link to={`/article/${article._id}`} className="block group">
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${featured ? 'md:col-span-2 md:row-span-2' : ''} animate-fadeInUp`}>
        <div className="relative overflow-hidden">
          <img
            src={article.imageUrl || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'}
            alt={article.title}
            className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${
              featured ? 'h-64 md:h-80' : 'h-48'
            }`}
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              categoryColors[article.category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
            }`}>
              {article.category}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className={`p-6 ${featured ? 'md:p-8' : ''}`}>
          <h3 className={`font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 ${
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            {article.title}
          </h3>
          
          <p className={`text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 ${
            featured ? 'text-base md:text-lg' : 'text-sm'
          }`}>
            {article.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Admin</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;