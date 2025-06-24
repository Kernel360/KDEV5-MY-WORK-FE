// src/api/checklist.js
import api from "./api";

/**
 * 체크리스트 생성
 * @param {object} data - ProjectCheckListCreateWebRequest 형태
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectCheckListCreateWebResponse>
 */
export const createCheckList = (data) =>
  api.post("/api/projects/check-lists", data);

/**
 * 체크리스트 상세 조회
 * @param {string} checkListId - UUID
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectCheckListDetailWebResponse>
 */
export const getCheckListById = (checkListId) =>
  api.get(`/api/projects/check-lists/${checkListId}`);

/**
 * 체크리스트 수정
 * @param {object} data - ProjectCheckListUpdateWebRequest 포함
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectCheckListUpdateWebResponse>
 */
export const updateCheckList = (data) =>
  api.put("/api/projects/check-lists", data);

/**
 * 체크리스트 삭제
 * @param {string} checkListId - UUID
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectCheckListDeleteWebResponse>
 */
export const deleteCheckList = (checkListId) =>
  api.delete(`/api/projects/check-lists/${checkListId}`);

/**
 * 체크리스트 승인
 * @param {string} checklistId - UUID
 * @param {object} data - ProjectCheckListApprovalWebRequest
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectCheckListApprovalWebResponse>
 */
export const approveCheckList = (checklistId, data) =>
  api.put(`/api/projects/check-lists/${checklistId}/approval`, data);

/**
 * 프로젝트 단계별 체크리스트 진행률 조회
 * @param {string} projectId - UUID
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectCheckListProgressListWebResponse>
 */
export const getCheckListProgress = (projectId) =>
  api.get(`/api/projects/${projectId}/check-list/progress`);

/**
 * 프로젝트별 체크리스트 목록 조회
 * @param {string} projectId - UUID
 * @param {string} [projectStepId] - 선택적 단계 ID (query param)
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<CheckListsSelectWebResponse>
 */
export const getCheckLists = (projectId, projectStepId) =>
  api.get(`/api/projects/${projectId}/check-list`, {
    params: projectStepId ? { projectStepId } : {},
  });
