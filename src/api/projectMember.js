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

/**
 * 프로젝트에 참여중인 내 회사의 모든 멤버 조회
 * GET /api/project-member?projectId={projectId}&companyId={companyId}
 *
 * @param {string} projectId - 조회할 프로젝트의 UUID
 * @param {string} companyId - 내 회사의 UUID
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<CompanyMembersInProjectWebResponse>
 */
export function getCompanyMembersInProject(projectId, companyId) {
  return api.get(
    `/api/project-member`,
    { params: { projectId, companyId } }
  );
}

/**
 * 프로젝트 멤버 삭제
 * DELETE /api/project-member?memberId={memberId}&projectId={projectId}
 *
 * @param {string} projectId - 프로젝트의 UUID
 * @param {string} memberId  - 삭제할 멤버의 UUID
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectMemberDeleteWebResponse>
 */
export function deleteProjectMember(projectId, memberId) {
  return api.delete(
    `/api/project-member`,
    { params: { projectId, memberId } }
  );
}

/**
 * 프로젝트 멤버 리스트 조회
 * GET /api/projects/members?companyId={companyId}&projectId={projectId}
 *
 * @param {string} companyId - 조회할 회사의 UUID
 * @param {string} projectId - 조회할 프로젝트의 UUID
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ProjectMemberListWebResponse>
 */
export function getProjectMemberList(companyId, projectId) {
  return api.get(
    `/api/projects/members`,
    { params: { companyId, projectId } }
  );
}
