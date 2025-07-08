import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, LinkIcon } from 'lucide-react';
import { newsAPI } from '../utils/api';

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId) => {
    try {
      setLoading(true);
      const data = await newsAPI.getArticle(articleId);
      console.log('Loaded article:', data);
      setArticle(data);
    } catch (err) {
      setError('Failed to load article');
      console.error('Error loading article:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = article?.title || 'NewsHub Article';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          alert('Link copied to clipboard!');
        } catch (err) {
          console.error('Failed to copy link:', err);
        }
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center animate-fadeInUp">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || 'The article you are looking for does not exist.'}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const categoryColors = {
    Technology: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Sports: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Politics: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Entertainment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    Health: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Business: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-colors duration-300 animate-fadeInUp">
          {/* Article Header */}
          <div className="px-6 py-8 sm:px-8">
            <div className="mb-6">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                categoryColors[article.category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                {article.category}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-fadeInUp animation-delay-200">
              {article.title}
            </h1>
            
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-6 animate-fadeInUp animation-delay-400">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Admin</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
              </div>
              
              {/* Share Buttons */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 dark:text-gray-400">Share:</span>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 rounded-full text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 transform hover:scale-110"
                  title="Share on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 rounded-full text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 transform hover:scale-110"
                  title="Share on Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
                  title="Copy Link"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Article Image */}
          <div className="px-6 sm:px-8 mb-8 animate-fadeInUp animation-delay-600">
            <img
              src={article.imageUrl || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'}
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg transform hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Article Content */}
          <div className="px-6 sm:px-8 pb-8 animate-fadeInUp animation-delay-800">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {article.description}
              </p>
              
              <div className="text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-line">
                {article.content}
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-8 text-center animate-fadeInUp animation-delay-1000">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </article>
    </div>
  );
};

export default ArticlePage;