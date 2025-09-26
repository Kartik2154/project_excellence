import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:5000/api
});

// ✅ Add Authorization header automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Consistent token key
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
  getActive: () => api.get("/guides/active"), // Added for GroupManagement
  add: (payload) => api.post("/guides", payload),
  update: (id, payload) => api.patch(`/guides/${id}`, payload),
  delete: (id) => api.delete(`/guides/${id}`),
  updateStatus: (id, status) => api.patch(`/guides/${id}/status`, { status }),
};

// ✅ Groups API
export const groupAPI = {
  getAll: (params) => api.get("/groups", { params }), // Supports course and year filters
  getById: (id) => api.get(`/groups/${id}`),
  getAvailableStudents: (id, params) =>
    api.get(`/groups/${id}/students/available`, { params }),
  create: (payload) => api.post("/groups", payload),
  update: (id, payload) => api.put(`/groups/${id}`, payload),
  delete: (id) => api.delete(`/groups/${id}`),
};

// ✅ Students API
export const studentAPI = {
  getAll: () => api.get("/students"),
  getAvailable: (params) => api.get("/students/available", { params }),
};

// ✅ Divisions API
export const divisionAPI = {
  getAll: () => api.get("/divisions"),
};

// ✅ Enrollments API
export const enrollmentAPI = {
  getAll: () => api.get("/enrollments"),
};

export default api;
