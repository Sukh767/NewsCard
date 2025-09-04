import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { newsAPI } from '../utils/api';

const EditNews = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Technology',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const categories = ['Technology', 'Sports', 'Politics', 'Entertainment', 'Health', 'Business'];

  useEffect(() => {
    if (id) {
      loadArticle(id);
    }
  }, [id]);

  const loadArticle = async (articleId) => {
    try {
      const data = await newsAPI.getArticle(articleId);
      setArticle(data);
      setFormData({
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
        imageUrl: data.imageUrl || '',
      });
      setImagePreview(data.imageUrl || '');
    } catch (err) {
      setError('Failed to load article');
      console.error('Error loading article:', err);
    } finally {
      setLoadingArticle(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, imageUrl: url }));
    if (url) {
      setImagePreview(url);
      setImageFile(null);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('content', formData.content);
      submitData.append('category', formData.category);
      
      if (imageFile) {
        submitData.append('file', imageFile); // Ensure the key matches the backend
      } else if (formData.imageUrl) {
        submitData.append('imageUrl', formData.imageUrl);
      }

      console.log("FormData content:");
      for (let [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }

      await newsAPI.updateArticle(id, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Explicitly set content type
        },
      });
      navigate('/admin');
    } catch (err) {
      setError('Failed to update article. Please try again.');
      console.error('Error updating article:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingArticle) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center animate-fadeInUp">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">The article you are trying to edit does not exist.</p>
            <button
              onClick={() => navigate('/admin')}
              className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-300">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white animate-fadeInLeft">Edit Article</h1>
          <p className="text-gray-600 dark:text-gray-300 animate-fadeInLeft animation-delay-200">Update your news article.</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-colors duration-300 animate-fadeInUp">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-6 animate-shake">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Title */}
                  <div className="animate-fadeInUp animation-delay-200">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                      placeholder="Enter article title"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="animate-fadeInUp animation-delay-400">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                      required
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div className="animate-fadeInUp animation-delay-600">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Short Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                      placeholder="Enter a brief description of the article"
                      required
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div className="animate-fadeInUp animation-delay-800">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Article Image
                    </label>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mb-4 relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {/* File Upload */}
                    <div className="mb-4">
                      <label htmlFor="image" className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Upload New Image File
                      </label>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                      />
                    </div>

                    {/* Or URL */}
                    <div>
                      <label htmlFor="imageUrl" className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Or Enter Image URL
                      </label>
                      <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleImageUrlChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="mt-6 animate-fadeInUp animation-delay-1000">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Article Content *
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                  placeholder="Write your article content here..."
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-end space-x-4 animate-fadeInUp animation-delay-1200">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Updating...' : 'Update Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNews;