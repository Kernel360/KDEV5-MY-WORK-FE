import api from "./api";

export const getNotifications = (page, isRead) =>
  api.get("/api/notifications", {
    params: {
      page,
      ...(isRead !== undefined && { isRead }),
    },
  });

export const readNotification = (data) => api.put("/api/notifications", data);

export const getUnreadNotificationCount = () =>
  api.get("/api/notifications/unread-count");

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const connectToNotificationStream = () =>
  `${baseURL}/api/real-notifications/connect`;
