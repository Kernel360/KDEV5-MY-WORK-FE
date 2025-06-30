import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshNotifications } from "@/features/notifications/notificationSlice";

export default function useNotificationPolling(
  enabled = true,
  intervalMs = 18000
) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => !!state.auth?.user);

  useEffect(() => {
    if (!enabled || !isLoggedIn) return;

    dispatch(refreshNotifications());

    const timerId = setInterval(() => {
      dispatch(refreshNotifications());
    }, intervalMs);

    return () => clearInterval(timerId);
  }, [dispatch, enabled, isLoggedIn, intervalMs]);
}
