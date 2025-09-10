import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";
// const API_BASE_URL = "https://newscard-backend-xwhi.onrender.com";

// Create axios instance with credentials enabled
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on authentication error
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Helper for safe API calls
const safeApiCall = async (apiCall) => {
  try {
    return await apiCall();
  } catch (error) {
    // console.log(error)
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

  likeArticle: async (id) => {
    const response = await safeApiCall(() => api.patch(`/news/${id}/like`));
    return response?.data || null;
  },

  unlikeArticle: async (id) => {
    const response = await safeApiCall(() => api.patch(`/news/${id}/unlike`));
    return response?.data || null;
  },
};

export const authAPI = {
  login: async (email, password) => {
    const response = await safeApiCall(() => api.post("/users/login", { email, password }));
    console.log("login api call", response)
    return response?.data || null;
  },

  register: async (userData) => {
    const response = await safeApiCall(() => api.post("/users/register", userData));
    return response?.data || null;
  },

  getProfile: async () => {
    const response = await safeApiCall(() =>
      api.get("/users/profile")
    );
    return response?.data || null;
  },

// In your api.js or authAPI file
updateProfile: async (formData) => {
  const response = await safeApiCall(() =>
    api.put("/users/update", formData, { 
      headers: { 
        "Content-Type": "multipart/form-data" 
      } 
    })
  );
  return response?.data || null;
},

  logout: async () => {
    const response = await safeApiCall(() => api.post("/users/logout"));
    console.log(response)
    return response?.data || null;
  },
};

export default api;
