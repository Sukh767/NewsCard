import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const newsAPI = {
  // Get all news articles
  getAllNews: async (category, search) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    const response = await api.get(`/news?${params}`);
    return response.data;
  },

  // Get single article
  getArticle: async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  // Create new article
  createArticle: async (formData) => {
    const response = await api.post('/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update article
  updateArticle: async (id, formData) => {
    const response = await api.put(`/news/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete article
  deleteArticle: async (id) => {
    await api.delete(`/news/${id}`);
  },
};

export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/users/login', { username, password });
    return response.data;
  },

  register: async (username, email, password) => {
    const response = await api.post('/users/register', { username, email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  // Update profile
  updateProfile: async (formData) => {
  const response = await api.put('/users/update', formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
},

};

export default api;