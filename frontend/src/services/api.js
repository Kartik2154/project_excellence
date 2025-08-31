import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:5000/api
});

export const authAPI = {
  login: async (payload) => {
    const { data } = await api.post("/admin/login", payload);
    // backend should return: { token, data: { ...admin } }
    return data;
  },
};

export default api;