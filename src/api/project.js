import api from "./api";

export function getProjects(params) {
  return api.get("/api/projects", { params });
}
export const getProjectById = (id) => api.get(`api/projects/${id}`);
export const createProject = (data) => api.post("api/projects", data);
export const updateProject = (id, data) => api.put(`api/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`api/projects/${id}`);
