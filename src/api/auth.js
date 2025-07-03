import api from "./api";

export const login = (data) => api.post("api/login", data, {withCredentials: true});
export const reissueToken = () => api.post("/api/reissue");
export const logout = () => api.post("/api/logout");
