// src/api/project.js
import api from "./api";

/**
 * 프로젝트 목록 조회
 * - 페이지 번호, 멤버 ID, 프로젝트명 키워드, 삭제 여부 등의 검색 조건을 params로 전달합니다.
 * @param {{ page: number; memberId?: string; nameKeyword?: string; deleted?: boolean }} params
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectListWebResponse>
 */
export function getProjects(params) {
  return api.get("/api/projects", { params });
}

/**
 * 내 프로젝트 목록 조회 (역할 기반)
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectListWebResponse>
 */
export function getMyProjects() {
  return api.get("/api/projects/my-projects");
}

/**
 * 단일 프로젝트 조회
 * - URL PathVariable로 전달된 projectId로 특정 프로젝트 상세 조회
 * @param {string} id - 조회할 프로젝트의 UUID
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectDetailWebResponse>
 */
export const getProjectById = (id) => api.get(`/api/projects/${id}`);

/**
 * 프로젝트 생성
 * - RequestBody로 ProjectCreateWebRequest 형태의 데이터 전달
 * @param {{ name: string; description?: string; }} data
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectCreateWebResponse>
 */
export const createProject = (data) => api.post("/api/projects", data);

/**
 * 프로젝트 수정
 * - PathVariable로 projectId, RequestBody로 ProjectUpdateWebRequest DTO 전달
 * @param {string} id - 수정할 프로젝트의 UUID
 * @param {{ name?: string; description?: string;  }} data
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectUpdateWebResponse>
 */
export const updateProject = (project) => {
  const { id: projectId, ...webRequest } = project;
  return api.put(`/api/projects/${projectId}`, webRequest);
};

/**
 * 프로젝트 삭제
 * - RequestBody로 ProjectDeleteWebRequest DTO 전달
 * @param {{ id: string }} data - 삭제할 프로젝트의 UUID를 포함한 객체
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectDeleteWebResponse>
 */
export function deleteProject({ id }) {
  // DELETE 요청에 body를 붙이려면 config.data에 넣어야 합니다.
  return api.delete("/api/projects", { data: { id } });
}

/**
 * 프로젝트 멤버 목록 조회
 * - companyId, projectId를 query params로 전달합니다.
 * @param {{ companyId: string; projectId: string }} params
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectMemberListWebResponse>
 */
export function getProjectMembers(params) {
  return api.get("/api/projects/members", { params });
}

/**
 * 프로젝트 상태 변경
 * @param {string} projectId - 프로젝트 UUID
 * @param {string} status - 변경할 상태(CONTRACT, IN_PROGRESS, PAYMENT, COMPLETED)
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectStatusUpdateWebResponse>
 */
export function updateProjectStatus(projectId, status) {
  return api.put("/api/projects/project-status", null, {
    params: { projectId, status },
  });
}
