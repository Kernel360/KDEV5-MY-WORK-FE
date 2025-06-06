// src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const rawAxios = axios.create({
          baseURL: "http://localhost:8080",
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        const refreshRes = await rawAxios.post("/api/reissue");

        if (refreshRes.status !== 200) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          return Promise.reject(refreshRes);
        }

        const newToken = refreshRes.data.data.accessToken;
        localStorage.setItem("accessToken", newToken);

        api.defaults.headers.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
