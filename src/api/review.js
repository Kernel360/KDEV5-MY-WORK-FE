import api from "./api";

/**
 * 리뷰 생성
 * POST /api/reviews
 *
 * @param {{ 
 *   postId: string; 
 *   parentId?: string; 
 *   comment: string; 
 *   // (인증 로직 추가 후 authorId, authorName, authorCompany 등은 자동 포함)
 * }} data
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ReviewCreateWebResponse>
 */
export function createReview(data) {
  return api.post("/api/reviews", data);
}

/**
 * 리뷰 수정
 * PUT /api/reviews/{reviewId}
 *
 * @param {string} reviewId - 수정할 리뷰의 UUID
 * @param {{ comment: string }} data - 수정할 댓글 내용
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ReviewModifyWebResponse>
 */
export function modifyReview(reviewId, data) {
  return api.put(`/api/reviews/${reviewId}`, data);
}

/**
 * 리뷰 삭제
 * DELETE /api/reviews/{reviewId}
 *
 * @param {string} reviewId - 삭제할 리뷰의 UUID
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ReviewDeleteWebResponse>
 */
export function deleteReview(reviewId) {
  return api.delete(`/api/reviews/${reviewId}`);
}

/**
 * 리뷰 목록 조회 (페이징)
 * GET /api/posts/{postId}/reviews?page={page}
 *
 * @param {string} postId - 조회할 게시글의 UUID
 * @param {number} page - 페이지 번호 (1부터 시작)
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<ReviewsSelectWebResponse>
 */
export function fetchReviewsByPost(postId, page = 1) {
  return api.get(`/api/posts/${postId}/reviews`, {
    params: { page },
  });
}
