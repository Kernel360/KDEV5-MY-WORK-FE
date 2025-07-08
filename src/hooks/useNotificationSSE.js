import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUnreadNotificationCount } from "@/features/notifications/notificationSlice";
import { getAccessToken, getUser } from "@/features/auth/authSlice";
import { EventSourcePolyfill } from "event-source-polyfill";

const SSE_URL = `${import.meta.env.VITE_API_URL}/api/real-notifications/connect`;

export default function useNotificationSSE(enabled = true) {
  const dispatch = useDispatch();
  const token = useSelector(getAccessToken);
  const user = useSelector(getUser);
  const isLoggedIn = !!token && !!user;

  const eventSourceRef = useRef(null);

  useEffect(() => {
    if (!enabled || !isLoggedIn || !token) return;

    eventSourceRef.current?.close();

    const eventSource = new EventSourcePolyfill(SSE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {};

    eventSource.onerror = (error) => {};

    eventSource.addEventListener("unread-notification-count", (event) => {
      try {
        const count = Number(event.data);
        if (!isNaN(count)) {
          dispatch(fetchUnreadNotificationCount());
        }
      } catch (err) {}
    });

    return () => {
      eventSource.close();
    };
  }, [enabled, isLoggedIn, token]);
}
