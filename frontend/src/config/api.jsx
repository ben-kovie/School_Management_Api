import axios from "axios";

const api = axios.create({
  baseURL: "https://school-management-api-51zb.onrender.com/api/v1",
});

/* Attach access token */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* Handle token refresh */
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      const res = await api.post("/auth/refresh-token", { refreshToken });
      localStorage.setItem("accessToken", res.data.accessToken);
      err.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return api(err.config);
    }
    return Promise.reject(err);
  }
);

export default api;
