// src/api/member.js
import api from "./api";

/**
 * 회사 소속 멤버 목록 조회
 * GET /api/member?page={page}&companyId={companyId}&keyword={keyword}&keywordType=NAME
 *
 * @param {string} companyId - 조회할 회사 UUID
 * @param {number} [page=1] - 페이지 번호 (1 이상)
 * @param {string} [keyword=""] - 검색어 (이름 기준)
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<MemberListWebResponse>
 */
export function getCompanyMembers(companyId, page = 1, keyword = "") {
  return api.get(`/api/member`, {
    params: {
      page,
      companyId,
      keyword: keyword || null,
      keywordType: keyword ? "NAME" : null,
    },
  });
}

/**
 * 단일 멤버 조회
 * GET /api/member/{memberId}
 *
 * @param {string} memberId - 조회할 멤버 UUID
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<MemberSelectWebResponse>
 */
export const getMemberById = (memberId) => api.get(`/api/member/${memberId}`);

/**
 * 멤버 생성
 * POST /api/member
 *
 * @param {{ name: string; email: string; position: string; department: string; phoneNumber?: string; companyId: string }} data
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<MemberCreateWebResponse>
 */
export const createMember = (data) => api.post(`/api/member`, data);

/**
 * 멤버 수정
 * PUT /api/member
 *
 * @param {{ id: string; name?: string; email?: string; position?: string; department?: string; phoneNumber?: string }} data
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<MemberUpdateWebResponse>
 */
export const updateMember = (data) => api.put("/api/member", data);

/**
 * 멤버 삭제
 * DELETE /api/member
 *
 * @param {{ memberId: string }} data
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<MemberDeleteWebResponse>
 */
export const deleteMember = (data) => api.delete(`/api/member`, { data });

/**
 * 멤버 검색 조회
 * GET /api/member?page={page}&keyword={keyword}&keywordType={keywordType}
 *
 * @param {number} page - 페이지 번호 (1 이상)
 * @param {string} [keyword] - 검색 키워드
 * @param {('NAME'|'EMAIL'|'POSITION'|'DEPARTMENT'|'PHONENUMBER')} [keywordType] - 검색 타입
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<MemberListWebResponse>
 */
export function findMembers(page, keyword, keywordType) {
  return api.get(`/api/member`, {
    params: { page, keyword, keywordType },
  });
}
