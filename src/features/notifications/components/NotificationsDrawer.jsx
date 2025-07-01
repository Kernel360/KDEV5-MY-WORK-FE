import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPostById } from "@/features/project/post/postSlice";
import {
  fetchNotifications,
  markNotificationsAsRead,
  clearNotifications,
} from "@/features/notifications/notificationSlice";
import {
  getChecklistLabel,
  getPostLabel,
  getTargetLabel,
} from "@/utils/notificationLabelMap";
import NotificationContentBox from "../components/NotificationContentBox";
import { formatNotificationDate } from "@/utils/dateUtils";
import { alpha } from "@mui/material/styles";
import { fetchUnreadNotificationCount } from "@/features/notifications/notificationSlice";

export default function NotificationsDrawer({
  open,
  onClose,
  setAlertOpen,
  setAlertMessage,
  setAlertSeverity,
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const scrollBoxRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    notifications = [],
    loading,
    page,
    hasMore,
  } = useSelector((state) => state.notification);

  const [filter, setFilter] = useState("ALL");
  const [anchorEl, setAnchorEl] = useState(null);

  const SIDEBAR_WIDTH = 216;
  const DRAWER_WIDTH = 360;

  const getIsReadParam = (value) => {
    if (value === "READ") return true;
    if (value === "UNREAD") return false;
    return undefined;
  };

  useEffect(() => {
    if (!open) return;

    dispatch(clearNotifications());
    dispatch(
      fetchNotifications({
        page: 1,
        isRead: getIsReadParam(filter),
      })
    );
  }, [open, filter, dispatch]);

  useEffect(() => {
    const target = bottomRef.current;
    const root = scrollBoxRef.current;
    if (!target || !root || !hasMore || !open) return;

    let fetching = false;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !fetching && !loading) {
          fetching = true;
          try {
            await dispatch(
              fetchNotifications({
                page,
                isRead: getIsReadParam(filter),
              })
            ).unwrap();
          } catch (e) {
            console.error("Failed to fetch notifications:", e);
          } finally {
            fetching = false;
          }
        }
      },
      {
        root,
        threshold: 0.1,
        rootMargin: "0px 0px 100px 0px",
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [notifications, hasMore, open, dispatch, loading, page, filter]);

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      dispatch(markNotificationsAsRead(notif.id));
    }

    const navigationStrategies = {
      PROJECT_CHECK_LIST: () => {
        navigate(
          `/projects/${notif.projectId}/approvals?checklistId=${notif.targetId}`
        );
      },
      POST: async () => {
        try {
          await dispatch(markNotificationsAsRead(notif.id));
          await dispatch(fetchPostById(notif.targetId)).unwrap();
          navigate(
            `/projects/${notif.projectId}/posts?postId=${notif.targetId}`
          );
          onClose();
        } catch (err) {
          dispatch(fetchUnreadNotificationCount());
          if (err.error?.code === "ERROR_POST09") {
            setAlertMessage("삭제된 게시글입니다.");
            setAlertSeverity("error");
            setAlertOpen(true);
          } else {
            setAlertMessage("게시글 정보를 불러오지 못했습니다.");
            setAlertSeverity("error");
            setAlertOpen(true);
          }
        }
      },
    };

    const navigateToTarget = navigationStrategies[notif.targetType];
    if (navigateToTarget) {
      navigateToTarget();
      onClose();
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (value) => {
    if (value !== null) {
      setFilter(value);
    }
    handleMenuClose();
  };

  return (
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0, 0, 0, 0.2)",
        zIndex: 201,
        display: open ? "block" : "none",
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          position: "absolute",
          top: 0,
          left: isMobile ? 0 : SIDEBAR_WIDTH,
          width: isMobile ? "100vw" : DRAWER_WIDTH,
          height: "100vh",
          bgcolor: "background.paper",
          boxShadow: theme.shadows[4],
          borderTopRightRadius: 12,
          borderBottomRightRadius: 12,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out",
          display: "flex",
          flexDirection: "column",
          zIndex: 202,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            bgcolor: "background.paper",
            boxShadow: theme.shadows[4],
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            transform: open ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
            display: "flex",
            flexDirection: "column",
          }}
        >
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
              <Typography
                variant="h6"
                fontWeight={theme.typography.fontWeightBold}
              >
                알림
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => handleFilterSelect("ALL")}>
                  전체
                </MenuItem>
                <MenuItem onClick={() => handleFilterSelect("UNREAD")}>
                  읽지 않음
                </MenuItem>
                <MenuItem onClick={() => handleFilterSelect("READ")}>
                  읽음
                </MenuItem>
              </Menu>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Box
            ref={scrollBoxRef}
            sx={{ overflowY: "auto", flex: 1, px: 2, pb: 2 }}
          >
            <Stack spacing={1.5}>
              {notifications.length === 0 && !loading ? (
                <Box sx={{ textAlign: "center", mt: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    새로운 알림이 없습니다.
                  </Typography>
                </Box>
              ) : (
                notifications?.map((notif) => (
                  <Paper
                    key={notif.id}
                    elevation={notif.isRead ? 0 : 1}
                    onClick={() => handleNotificationClick(notif)}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 3,
                      px: 2,
                      py: 2,
                      bgcolor: notif.isRead
                        ? theme.palette.background.default
                        : "#ffffff",
                      border: `1px solid ${
                        notif.isRead
                          ? theme.palette.divider
                          : alpha(theme.palette.primary.main, 0.15)
                      }`,
                      transition: "all 0.2s ease",
                      boxShadow: "none",

                      "&:hover": {
                        backgroundColor: notif.isRead
                          ? theme.palette.grey[100]
                          : "#f8f8f8",
                        transform: "translateY(-1px)",
                        boxShadow: notif.isRead
                          ? "0 2px 4px rgba(0, 0, 0, 0.1)"
                          : "0 4px 12px rgba(26, 26, 26, 0.12)",
                      },
                    }}
                  >
                    <Stack spacing={1}>
                      <Box display="flex" alignItems="flex-start" gap={1.5}>
                        {!notif.isRead && (
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              mt: "4px",
                              borderRadius: "50%",
                              bgcolor: theme.palette.status.error.main,
                              flexShrink: 0,
                              boxShadow: `0 0 0 4px ${alpha(
                                theme.palette.status.error.main,
                                0.2
                              )}`,
                              animation: "pulse 1.33s infinite",
                              "@keyframes pulse": {
                                "0%": {
                                  boxShadow: `0 0 0 0 ${alpha(
                                    theme.palette.status.error.main,
                                    0.7
                                  )}`,
                                  transform: "scale(0.8)",
                                },
                                "70%": {
                                  boxShadow: `0 0 0 6px ${alpha(
                                    theme.palette.status.error.main,
                                    0
                                  )}`,
                                  transform: "scale(1)",
                                },
                                "100%": {
                                  boxShadow: `0 0 0 0 ${alpha(
                                    theme.palette.status.error.main,
                                    0
                                  )}`,
                                  transform: "scale(0.8)",
                                },
                              },
                            }}
                          />
                        )}
                        <Typography
                          variant="body2"
                          fontWeight={
                            notif.isRead
                              ? theme.typography.fontWeightRegular
                              : theme.typography.fontWeightMedium
                          }
                          color={
                            notif.isRead ? "text.secondary" : "text.primary"
                          }
                          sx={{
                            wordBreak: "keep-all",
                            lineHeight: 1.6,
                            flex: 1,
                            ml: !notif.isRead ? 0 : 2,
                          }}
                        >
                          {notif.targetType === "POST" &&
                          notif.actionType !== "REVIEW"
                            ? `${notif.actorName}님이 ${getTargetLabel(notif.targetType)}의 상태를 ${getPostLabel(
                                notif.actionType
                              )}로 변경하였습니다.`
                            : `${notif.actorName}님이 ${getTargetLabel(notif.targetType)}에 대해 ${getChecklistLabel(
                                notif.actionType
                              )}을(를) 남겼습니다.`}
                        </Typography>
                      </Box>

                      <Box sx={{ pl: !notif.isRead ? 2.5 : 3 }}>
                        <NotificationContentBox
                          targetType={notif.targetType}
                          content={notif.content}
                          isUnread={!notif.isRead}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={
                            notif.isRead
                              ? theme.typography.fontWeightRegular
                              : theme.typography.fontWeightMedium
                          }
                          sx={{ ml: "auto" }}
                        >
                          {formatNotificationDate(notif.actionTime)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                ))
              )}

              <div ref={bottomRef} style={{ height: 10 }} />
              {loading && (
                <Box sx={{ textAlign: "center", mt: 2, mb: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
