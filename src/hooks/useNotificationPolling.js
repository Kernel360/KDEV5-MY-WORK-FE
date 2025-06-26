// src/hooks/useNotificationPolling.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "@/features/notifications/notificationSlice";

export default function useNotificationPolling(
  intervalMs = 18000,
  page = 1,
  isRead
) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => !!state.auth?.user); // 또는 state.auth.isLoggedIn

  useEffect(() => {
    if (!isLoggedIn) return;

    dispatch(fetchNotifications({ page, isRead }));

    const timerId = setInterval(() => {
      dispatch(fetchNotifications({ page, isRead }));
    }, intervalMs);

    return () => clearInterval(timerId);
  }, [dispatch, intervalMs, page, isRead, isLoggedIn]);
}
