import api from "./api";

export function getCompanies(params) {
  return api.get("/api/companies", { params });
}

export const generateCompanyId = () => api.post("/api/companies/id/generate");
export const getCompanyById = (id) => api.get(`/api/companies/${id}`);
export const createCompany = (data) => api.post("/api/companies", data);
export const updateCompany = (id, data) =>
  api.put(`/api/companies/${id}`, data);
export const deleteCompany = (id) => api.delete(`/api/companies/${id}`);
export function getCompanyNamesByType(companyType) {
  return api.get("/api/companies/names", {
    params: { companyType },
  });
}