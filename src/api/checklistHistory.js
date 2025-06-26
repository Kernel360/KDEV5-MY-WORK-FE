// src/api/checklist.js
import api from "./api";

/**
 * 체크리스트 이력 조회
 * @param {string} checkListId - 체크리스트 UUID
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<CheckListHistorySelectWebResponse[]>
 */
export const getCheckListHistories = (checkListId) =>
  api.get(`/api/projects/checkLists/${checkListId}/histories`);
