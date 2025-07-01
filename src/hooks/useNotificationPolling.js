import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnreadNotificationCount } from "@/features/notifications/notificationSlice";

export default function useNotificationPolling(
  enabled = true,
  intervalMs = 180000
) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => !!state.auth?.user);

  useEffect(() => {
    if (!enabled || !isLoggedIn) return;

    dispatch(fetchUnreadNotificationCount());

    const timerId = setInterval(() => {
      dispatch(fetchUnreadNotificationCount());
    }, intervalMs);

    return () => clearInterval(timerId);
  }, [dispatch, enabled, isLoggedIn, intervalMs]);
}
