import React, { useState, useEffect } from 'react';
import { BarChart3, Users, FileText, TrendingUp, Edit, Trash2 } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { newsAPI } from '../utils/api';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    totalUsers: 2,
    articlesThisMonth: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await newsAPI.getAllNews();
      console.log('Loaded articles:', response);

      const articlesData = response.news || [];
      setArticles(articlesData);

      const now = new Date();
      const thisMonth = articlesData.filter(article => {
        const articleDate = new Date(article.createdAt);
        return articleDate.getMonth() === now.getMonth() && 
               articleDate.getFullYear() === now.getFullYear();
      });

      setStats({
        totalArticles: articlesData.length,
        totalViews: Math.floor(Math.random() * 10000) + 1000, // Mock data
        totalUsers: Math.floor(Math.random() * 50) + 50, // Mock data
        articlesThisMonth: thisMonth.length,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await newsAPI.deleteArticle(id);
        setArticles(articles.filter(article => article._id !== id));
        setStats(prev => ({ ...prev, totalArticles: prev.totalArticles - 1 }));
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Failed to delete article');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Welcome back! Here's what's happening with your news site.</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Articles</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalArticles}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalViews.toLocaleString()}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.articlesThisMonth}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          {/* Recent Articles */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-300">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Articles</h2>
                <Link
                  to="/admin/add-news"
                  className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300"
                >
                  Add New Article
                </Link>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {articles.slice(0, 10).map((article) => (
                    <tr key={article._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      {/* Image + Title */}
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <img
                          src={article.imageUrl || 'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=80&w=80'}
                          alt={article.title}
                          className="h-10 w-10 rounded-md object-cover mr-3"
                        />
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                          {article.title}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {article.category}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(article.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          to={`/admin/edit-news/${article._id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 inline-flex items-center transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteArticle(article._id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 inline-flex items-center transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {articles.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No articles yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Get started by creating your first article.</p>
                <Link
                  to="/admin/add-news"
                  className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300"
                >
                  Create Article
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
