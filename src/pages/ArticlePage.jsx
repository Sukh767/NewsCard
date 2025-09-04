import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, User, Share2, Facebook, Twitter, LinkIcon, 
  Clock, Eye, Heart, MessageCircle, Bookmark, Tag, ArrowUp
} from 'lucide-react';
import { newsAPI } from '../utils/api';

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }

    // Scroll event listener
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id]);

  const loadArticle = async (articleId) => {
    try {
      setLoading(true);
      const data = await newsAPI.getArticle(articleId);
      console.log('Loaded article:', data);
      setArticle(data);
      
      // Simulate engagement metrics (in a real app, these would come from the API)
      setLikeCount(Math.floor(Math.random() * 100) + 50);
      setViewCount(Math.floor(Math.random() * 1000) + 500);
      
      // Check if article is bookmarked (simulated)
      setIsBookmarked(localStorage.getItem(`bookmark_${articleId}`) === 'true');
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

  const timeToRead = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const toCloudinaryUrl = (url) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://res.cloudinary.com/drhfcappf/image/upload/${url}`;
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
          // Show toast notification instead of alert
          const toast = document.createElement('div');
          toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fadeIn';
          toast.textContent = 'Link copied to clipboard!';
          document.body.appendChild(toast);
          setTimeout(() => {
            toast.remove();
          }, 2000);
        } catch (err) {
          console.error('Failed to copy link:', err);
        }
        break;
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    localStorage.setItem(`bookmark_${id}`, !isBookmarked);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center animate-fadeInUp max-w-md mx-4">
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || 'The article you are looking for does not exist.'}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg z-40 hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 animate-bounce"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b dark:border-gray-700 transition-colors duration-300 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all duration-300 transform hover:scale-105 group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
            
            {/* Engagement Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{viewCount.toLocaleString()} views</span>
              </div>
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 transition-all duration-300 ${
                  isLiked ? 'text-red-600 dark:text-red-400' : 'hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likeCount.toLocaleString()}</span>
              </button>
              <button
                onClick={handleBookmark}
                className={`transition-all duration-300 ${
                  isBookmarked 
                    ? 'text-yellow-600 dark:text-yellow-400' 
                    : 'hover:text-yellow-600 dark:hover:text-yellow-400'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-300 animate-fadeInUp border border-gray-200 dark:border-gray-700">
          {/* Article Header */}
          <div className="px-6 py-8 sm:px-8 sm:py-12">
            <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                categoryColors[article.category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
              }`}>
                <Tag className="h-3 w-3 mr-1.5" />
                {article.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-fadeInUp animation-delay-200 tracking-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 dark:text-gray-400 mb-6 animate-fadeInUp animation-delay-400 gap-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">Admin</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{timeToRead(article.content)} min read</span>
                </div>
              </div>
              
              {/* Share Buttons */}
              <div className="flex items-center space-x-3">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Share:</span>
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-full p-1">
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 rounded-full text-blue-600 hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
                    title="Share on Facebook"
                  >
                    <Facebook className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 rounded-full text-blue-400 hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
                    title="Share on Twitter"
                  >
                    <Twitter className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
                    title="Copy Link"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Article Image */}
          <div className="px-6 sm:px-8 mb-8 animate-fadeInUp animation-delay-600">
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <img
                src={toCloudinaryUrl(article.imageUrl) || 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Article Content */}
          <div className="px-6 sm:px-8 pb-12 animate-fadeInUp animation-delay-800">
            <div className="max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed font-light italic border-l-4 border-blue-500 pl-6 py-2">
                {article.description}
              </p>
              
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-blue-500 prose-blockquote:italic prose-ul:marker:text-blue-500 prose-ol:marker:text-blue-500">
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6 dark:text-white">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Article Footer */}
          <div className="px-6 sm:px-8 py-6 bg-gray-50 dark:bg-gray-700/50 border-t dark:border-gray-600">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {[article.category, 'News', 'Latest'].map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isLiked
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-300'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>Like ({likeCount})</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                  <span>Comment</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-12 text-center animate-fadeInUp animation-delay-1000">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </article>
    </div>
  );
};

export default ArticlePage;