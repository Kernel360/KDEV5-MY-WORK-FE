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
 * POST /api/projects/{projectId}/posts
 *
 * @param {string} projectId - 프로젝트 UUID
 * @param {{ id: string; title: string; content: string; projectStepId?: string; }} data
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<PostCreateWebResponse>
 */
export function createPost(projectId, data) {
  return api.post(`/api/projects/${projectId}/posts`, data);
}

/**
 * 게시글 수정
 * PUT /api/posts/{postId}
 *
 * @param {string} postId - 수정할 게시글의 UUID
 * @param {{ title?: string; content?: string; }} data
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

export function findPosts(projectId, page, { keyword, keywordType, projectStepId, deleted, approval }) {
  return api.get(`/api/projects/${projectId}/posts`, {
    params: {
      page,
      keyword,
      keywordType,
      projectStepId,
      deleted,
      approval,
    },
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
