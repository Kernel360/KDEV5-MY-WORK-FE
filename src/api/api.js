import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

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
          window.location.replace("/login");
          return Promise.reject(refreshRes);
        }

        const newToken = refreshRes.data.data.accessToken;
        localStorage.setItem("accessToken", newToken);

        return api(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem("accessToken");
        window.location.replace("/login");
        return Promise.reject(refreshErr);
      }
    }

    // 403 Forbidden 처리
    if (error.response?.status === 403) {
      // 전역 알럿 함수 직접 호출 (기존 방식과 동일)
      if (window.showGlobalAlert) {
        window.showGlobalAlert("권한이 부족합니다. 관리자에게 문의하세요.", "error");
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
