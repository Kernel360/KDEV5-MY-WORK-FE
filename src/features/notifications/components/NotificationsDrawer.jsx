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
import { useNavigate } from "react-router-dom";
import { fetchNotifications } from "@/features/notifications/notificationSlice";
import { getActionLabel, getTargetLabel } from "@/utils/notificationLabelMap";
import NotificationContentBox from "../components/NotificationContentBox";
import { formatNotificationDate } from "@/utils/dateUtils";
import { markNotificationsAsRead } from "../notificationSlice";

export default function NotificationsDrawer({ open, onClose }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      dispatch(markNotificationsAsRead(notif.id));
    }

    if (notif.targetType === "PROJECT_CHECK_LIST") {
      navigate(
        `/projects/${notif.projectId}/approvals?targetId=${notif.targetId}`
      );
      onClose();
    }
  };

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
          bgcolor: "background.paper",
          boxShadow: theme.shadows[4],
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
                onClick={() => handleNotificationClick(notif)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 3,
                  px: 2,
                  py: 2,
                  bgcolor: notif.isRead
                    ? theme.palette.background.default
                    : theme.palette.grey[100],
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: theme.palette.grey[200],
                  },
                }}
              >
                <Stack spacing={1}>
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    {!notif.isRead && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          mt: "6px",
                          borderRadius: "50%",
                          bgcolor: "text.primary",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      color="text.primary"
                      sx={{ wordBreak: "keep-all", lineHeight: 1.6 }}
                    >
                      {`${notif.actorName}님이 ${getTargetLabel(notif.targetType)}에 대해 ${getActionLabel(
                        notif.actionType
                      )}을(를) 남겼습니다.`}
                    </Typography>
                  </Box>

                  <NotificationContentBox
                    targetType={notif.targetType}
                    content={notif.content}
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    textAlign="right"
                  >
                    {formatNotificationDate(notif.createdAt)}
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
