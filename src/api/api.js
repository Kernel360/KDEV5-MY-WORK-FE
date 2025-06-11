import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL,
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

    // ✅ 로그인 요청은 reissue 하지 않도록 예외 처리
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/login")
    ) {
      originalRequest._retry = true;
      try {
        const rawAxios = axios.create({
          baseURL,
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        const refreshRes = await rawAxios.post("/api/reissue");

        if (refreshRes.status !== 200) {
          localStorage.removeItem("accessToken");
          window.location.replace("/login"); // ✅ 새로고침 없는 리다이렉트
          return Promise.reject(refreshRes);
        }

        const newToken = refreshRes.data.data.accessToken;
        localStorage.setItem("accessToken", newToken);

        api.defaults.headers.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem("accessToken");
        window.location.replace("/login");
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
