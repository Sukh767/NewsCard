import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Helper for safe API calls
const safeApiCall = async (apiCall) => {
  try {
    return await apiCall();
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return null;
  }
};

export const newsAPI = {
  getAllNews: async ({ category, search, page = 1, limit = 20 } = {}) => {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (search) params.append("search", search);
    params.append("page", page);
    params.append("limit", limit);

    const response = await safeApiCall(() => api.get(`/news?${params}`));
    return response?.data || { news: [], pagination: {} };
  },

  getArticle: async (id) => {
    const response = await safeApiCall(() => api.get(`/news/${id}`));
    return response?.data || null;
  },

  createArticle: async (formData) => {
    const response = await safeApiCall(() =>
      api.post("/news", formData, { headers: { "Content-Type": "multipart/form-data" } })
    );
    return response?.data || null;
  },

  updateArticle: async (id, formData) => {
    const response = await safeApiCall(() =>
      api.put(`/news/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } })
    );
    return response?.data || null;
  },

  deleteArticle: async (id) => {
    await safeApiCall(() => api.delete(`/news/${id}`));
  },
};

export const authAPI = {
  login: async (email, password) => {
    const response = await safeApiCall(() => api.post("/users/login", { email, password }));
    if (response?.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data.user;
    }
    return null;
  },

  register: async (name, email, password) => {
    const response = await safeApiCall(() => api.post("/users/register", { name, email, password }));
    if (response?.data) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data.user;
    }
    return null;
  },

  getProfile: async () => {
    const response = await safeApiCall(() => api.get("/users/profile"));
    return response?.data || null;
  },

  updateProfile: async (formData) => {
    const response = await safeApiCall(() =>
      api.put("/users/update", formData, { headers: { "Content-Type": "multipart/form-data" } })
    );
    return response?.data || null;
  },
};

export default api;
