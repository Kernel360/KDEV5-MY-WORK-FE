import api from "./api";

export const getProjects = () => api.get("/projects");
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.get("/projects", data);
export const updateProject = (id, data) => api.get(`/projects/${id}`, data);
export const deleteProject = (id) => api.get(`/projects/${id}`);
