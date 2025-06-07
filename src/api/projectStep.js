import api from "./api";

/**
 * 프로젝트 단계(스텝) 목록 조회
 * @param {string} projectId - 프로젝트 UUID
 */
export const getProjectStages = (projectId) =>
  api.get(`/api/projects/${projectId}/steps`);

/**
 * 프로젝트 단계 일괄 생성
 * @param {{ projectId: string, steps: Array<{ name: string, order: number }> }} data
 */
export const createProjectStages = (data) =>
  api.post(`/api/projects/steps`, data);

/**
 * 프로젝트 단계 일괄 수정
 * @param {string} projectId - 프로젝트 UUID
 * @param {Array<{ stepId: string, name: string, order: number }>} steps
 */
export const updateProjectStages = (projectId, projectStepUpdateWebRequests) =>
  api.put(`/api/projects/${projectId}/steps`, projectStepUpdateWebRequests );