import api from "./api";

/**
 * 프로젝트 체크리스트 생성
 * POST /api/projects/check-lists
 *
 * @param {{ projectId: string; items: Array<{ description: string; order?: number }> }} data
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectCheckListCreateWebResponse>
 */
export function createProjectCheckList(data) {
  return api.post("/api/projects/check-lists", data);
}
