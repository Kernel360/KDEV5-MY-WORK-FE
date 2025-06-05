import api from "./api";

export const getMembers = (params) => api.get("/api/member", { params });
export const getMemberById = (id) => api.get(`/members/${id}`);
export const createMember = (data) => api.post("/members", data);
export const updateMember = (id, data) => api.put(`/members/${id}`, data);
export const deleteMember = (id) => api.delete(`/members/${id}`);
