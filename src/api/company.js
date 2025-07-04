import api from "./api";

export function getCompanies(params) {
  return api.get("/api/companies", { params });
}

export const generateCompanyId = () => api.post("/api/companies/id/generate");
export const getCompanyById = (id) => api.get(`/api/companies/${id}`);
export const createCompany = (data) => api.post("/api/companies", data);
export const updateCompany = (data) => {
  return api.put(`/api/companies`, data);
};
export const deleteCompany = (id) => api.delete(`/api/companies/${id}`);
export function getCompanyNamesByType(companyType) {
  return api.get("/api/companies/names", {
    params: { companyType },
  });
}

/**
 * 회사 이미지 업로드를 위한 presigned URL 발급
 * POST /api/companies/images/upload-url/issue
 * 
 * @param {string} companyId - 회사 UUID
 * @param {string} fileName - 파일명
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<CompanyImageUploadUrlResponse>
 */
export function getCompanyImageUploadUrl(companyId, fileName) {
  return api.post(`/api/companies/images/upload-url/issue`, {
    companyId,
    fileName,
  });
}