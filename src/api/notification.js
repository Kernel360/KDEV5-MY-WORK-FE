import api from "./api";

/**
 * 알림 목록 조회 (페이지네이션 및 읽음 여부 필터 가능)
 * @param {number} page - 페이지 번호 (1부터 시작)
 * @param {boolean} [isRead] - 읽음 여부 필터 (true/false)
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<NotificationListSelectWebResponse>
 */
export const getNotifications = (page, isRead) =>
  api.get("/api/notifications", {
    params: {
      page,
      ...(isRead !== undefined && { isRead }), // 조건부 파라미터 추가
    },
  });

/**
 * 알림 읽음 처리
 * @param {object} data - NotificationReadWebRequest 형식 { ids: string[] }
 * @returns {Promise<import("axios").AxiosResponse>} ApiResponse<NotificationReadWebResponse>
 */
export const readNotification = (data) => api.put("/api/notifications", data);
