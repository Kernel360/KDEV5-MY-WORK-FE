import api from "./api";

/**
 * 프로젝트에 멤버 추가
 * POST /api/project-member/member?projectId={projectId}&memberId={memberId}
 *
 * @param {string} projectId - 멤버를 추가할 프로젝트의 UUID
 * @param {string} memberId  - 추가할 멤버의 UUID
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectMemberAddWebResponse>
 */
export function addProjectMember(projectId, memberId) {
  return api.post(
    `/api/project-member/member`,
    null,
    { params: { projectId, memberId } }
  );
}
