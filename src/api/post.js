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

export function findPosts(
  projectId,
  page,
  { keyword, keywordType, projectStepId, deleted, approval }
) {
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

// ===== 첨부파일 관련 API =====

/**
 * 게시글 파일 업로드 URL 발급
 * POST /api/posts/attachment/upload-url/issue
 *
 * @param {{ postId: string; fileName: string; }} data
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<PostAttachmentUploadUrlResponse>
 */
export function issueAttachmentUploadUrl(data) {
  return api.post("/api/posts/attachment/upload-url/issue", data);
}

/**
 * 게시글 파일 재업로드 URL 발급
 * POST /api/posts/attachment/upload-url/reissue
 *
 * @param {{ postAttachmentId: string; fileName: string; }} data
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<PostAttachmentReuploadUrlResponse>
 */
export function reissueAttachmentUploadUrl(data) {
  return api.post("/api/posts/attachment/upload-url/reissue", data);
}

/**
 * 게시글 파일 업로드 완료 상태 변경 (개별)
 * POST /api/posts/attachments/active
 *
 * @param {{ postAttachmentId: string; active: boolean; }} data
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<PostAttachmentActiveResponse>
 */
export function setAttachmentActive(data) {
  return api.post("/api/posts/attachments/active", {
    postAttachments: [data],
  });
}

/**
 * 게시글 파일 다운로드 URL 발급
 * GET /api/posts/attachment/download-url
 *
 * @param {string} postAttachmentId - 첨부파일 UUID
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<PostAttachmentDownloadUrlResponse>
 */
export function getAttachmentDownloadUrl(postAttachmentId) {
  return api.get("/api/posts/attachment/download-url", {
    params: { postAttachmentId },
  });
}

/**
 * Presigned URL로 이미지 다운로드 (S3에서 이미지 가져오기)
 * GET {presignedUrl}
 *
 * @param {string} presignedUrl - 발급받은 presigned URL
 * @returns {Promise<Blob>} 이미지 Blob 데이터
 */
export async function downloadImageFromS3(presignedUrl) {
  const response = await fetch(presignedUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }
  return response.blob();
}

/**
 * 게시글 첨부파일 삭제
 * DELETE /api/posts/attachment/{postAttachmentId}
 *
 * @param {string} postAttachmentId - 삭제할 첨부파일의 UUID
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<PostAttachmentDeleteResponse>
 */
export function deleteAttachment(postAttachmentId) {
  return api.delete(`/api/posts/attachment/${postAttachmentId}`);
}

/**
 * Presigned URL로 파일 업로드 (S3 직접 업로드)
 * PUT {presignedUrl}
 *
 * @param {string} presignedUrl - 발급받은 presigned URL
 * @param {File} file - 업로드할 파일
 * @returns {Promise<Response>} S3 업로드 응답
 */
export function uploadFileToS3(presignedUrl, file) {
  return fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
}

/**
 * 게시글 첨부파일 일괄 활성화
 * POST /api/posts/attachments/active
 *
 * @param {{ postId: string; }} data
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<PostAttachmentBulkActiveResponse>
 */
export function bulkActivateAttachments(data) {
  return api.post("/api/posts/attachments/active", {
    postId: data.postId,
    active: true,
  });
}

/**
 * 게시글의 모든 첨부파일 정리 (비활성화된 파일들 삭제)
 * DELETE /api/posts/{postId}/attachments/cleanup
 *
 * @param {string} postId - 게시글 UUID
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<PostAttachmentCleanupResponse>
 */
export function cleanupPostAttachments(postId) {
  return api.delete(`/api/posts/${postId}/attachments/cleanup`);
}

export const changePostApprovalStatus = (postId, approvalStatus) => {
  return api.put(`/api/posts/${postId}/approval`, {
    approvalStatus,
  });
};
