// src/api/post.js
import api from "./api";

/**
 * 게시글 ID 생성
 * POST /api/posts/id/generate
 *
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<PostIdCreateWebResponse>
 */
export function createPostId() {
  return api.post("/api/posts/id/generate");
}

/**
 * 게시글 생성
 * POST /api/posts
 *
 * @param {{ id: string; title: string; content: string; projectStepId?: string; /* 기타 생성 필드 */ }} data
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<PostCreateWebResponse>
 */
export function createPost(data) {
  return api.post("/api/posts", data);
}

/**
 * 게시글 수정
 * PUT /api/posts/{postId}
 *
 * @param {string} postId - 수정할 게시글의 UUID
 * @param {{ title?: string; content?: string; /* 기타 수정 필드 */ }} data
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<PostUpdateWebResponse>
 */
export function updatePost(postId, data) {
  return api.put(`/api/posts/${postId}`, data);
}

/**
 * 게시글 상세 조회
 * GET /api/posts/{postId}
 *
 * @param {string} postId - 조회할 게시글의 UUID
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<PostDetailWebResponse>
 */
export function getPostDetail(postId) {
  return api.get(`/api/posts/${postId}`);
}

/**
 * 게시글 목록 조회
 * GET /api/posts?page={page}&keyword={keyword}&projectStepId={projectStepId}&deleted={deleted}
 *
 * @param {number} page - 페이지 번호
 * @param {string} [keyword] - 검색 키워드
 * @param {string} [projectStepId] - 단계 UUID
 * @param {boolean} [deleted] - 삭제 여부 필터
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<PostListSelectWebResponse>
 */
export function findPosts(page, keyword, projectStepId, deleted) {
  return api.get("/api/posts", {
    params: { page, keyword, projectStepId, deleted },
  });
}

/**
 * 게시글 삭제
 * DELETE /api/posts/{postId}
 *
 * @param {string} postId - 삭제할 게시글의 UUID
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<PostDeleteWebResponse>
 */
export function deletePost(postId) {
  return api.delete(`/api/posts/${postId}`);
}
