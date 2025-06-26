import React, { useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "@/features/notifications/notificationSlice";
import { formatNotificationDate } from "@/utils/dateUtils";

const getActionLabel = (type) => {
  switch (type) {
    case "APPROVED":
      return "승인";
    case "REJECTED":
      return "반려";
    case "REQUEST_CHANGES":
      return "수정 요청";
    case "PENDING":
      return "결재 요청";
    default:
      return type;
  }
};

const getTargetLabel = (type) => {
  switch (type) {
    case "PROJECT_CHECK_LIST":
      return "결재 요청 항목";
    default:
      return type;
  }
};

export default function NotificationsDrawer({ open, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const { notifications = [], loading } = useSelector(
    (state) => state.notification
  );

  const SIDEBAR_WIDTH = 216;
  const DRAWER_WIDTH = 360;

  useEffect(() => {
    if (open) {
      dispatch(fetchNotifications({ page: 1 }));
    }
  }, [open, dispatch]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: SIDEBAR_WIDTH,
        width: DRAWER_WIDTH,
        height: "100vh",
        overflow: "hidden",
        zIndex: 201,
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          bgcolor: "#ffffff",
          boxShadow:
            "rgba(0, 0, 0, 0.1) 0px 6px 12px -4px, rgba(0, 0, 0, 0.05) 0px 2px 4px -1px",
          clipPath: "inset(0px -24px 0px 0px)",
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 헤더 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            m: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <NotificationsIcon sx={{ fontSize: 20, color: "text.primary" }} />
            <Typography variant="h6" fontWeight={600} color="text.primary">
              알림
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 알림 리스트 */}
        <Stack spacing={1.5} px={2} pb={2}>
          {loading ? (
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <CircularProgress />
            </Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ textAlign: "center", mt: 6 }}>
              <Typography variant="body2" color="text.secondary">
                새로운 알림이 없습니다.
              </Typography>
            </Box>
          ) : (
            notifications.map((notif) => (
              <Paper
                key={notif.id}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  px: 2,
                  py: 2,
                  backgroundColor: notif.isRead ? "#f9f9f9" : "#eeeeee",
                  border: "1px solid #e0e0e0",
                  transition: "all 0.2s ease",
                  overflow: "hidden",
                  "&:hover": {
                    backgroundColor: notif.isRead ? "#f0f0f0" : "#e5e5e5",
                  },
                }}
              >
                <Stack spacing={1}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                      lineHeight: 1.6,
                    }}
                  >
                    {!notif.isRead && (
                      <Box
                        component="span"
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#1a1a1a",
                          flexShrink: 0,
                          mt: "6px",
                        }}
                      />
                    )}
                    <span>
                      {notif.actorName}님이{" "}
                      <strong>{getTargetLabel(notif.targetType)}</strong>에 대해{" "}
                      <strong>{getActionLabel(notif.actionType)}</strong>을(를)
                      남겼습니다.
                    </span>
                  </Typography>
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      </Box>
    </Box>
  );
}
