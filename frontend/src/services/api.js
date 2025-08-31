// frontend/src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:5000/api
});

// ✅ Add Authorization header automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // make sure you store token on login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: async (payload) => {
    const { data } = await api.post("/admin/login", payload);
    // backend should return: { token, data: { ...admin } }
    // ✅ Save token for later requests
    localStorage.setItem("token", data.token);
    return data;
  },
};

// ✅ Guides API
export const guideAPI = {
  getAll: () => api.get("/guides"),
  add: (payload) => api.post("/guides", payload),
  update: (id, payload) => api.patch(`/guides/${id}`, payload),
  delete: (id) => api.delete(`/guides/${id}`),
  updateStatus: (id, status) => api.patch(`/guides/${id}/status`, { status }),
};

export default api;
