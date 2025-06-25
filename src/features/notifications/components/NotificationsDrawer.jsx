import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { formatNotificationDate } from "@/utils/dateUtils";
import NotificationsIcon from "@mui/icons-material/Notifications";

const mockNotifications = [
  {
    id: 1,
    title: "새로운 리뷰가 등록되었습니다.",
    content: '프로젝트 A의 "로그인 기능"에 새로운 리뷰가 달렸습니다.',
    date: dayjs().subtract(3, "hour").format("YYYY-MM-DDTHH:mm:ss"),
    read: false,
  },
  {
    id: 2,
    title: "결재가 승인되었습니다.",
    content: '요청하신 "디자인 시안"이 승인되었습니다.',
    date: dayjs().subtract(1, "day").format("YYYY-MM-DDTHH:mm:ss"),
    read: false,
  },
  {
    id: 3,
    title: "새로운 멤버가 초대되었습니다.",
    content: '김민준님이 "마케팅팀"에 합류했습니다.',
    date: dayjs().subtract(3, "day").format("YYYY-MM-DDTHH:mm:ss"),
    read: true,
  },
  {
    id: 4,
    title: "서버 점검 안내",
    content: "오늘 오후 10시에 정기 서버 점검이 있습니다.",
    date: dayjs().subtract(10, "day").format("YYYY-MM-DDTHH:mm:ss"),
    read: true,
  },
];

export default function NotificationsDrawer({ open, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const SIDEBAR_WIDTH = 216;
  const DRAWER_WIDTH = 360;

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
          {/* 필터 버튼들 생략 */}

          {mockNotifications.map((notif) => (
            <Paper
              key={notif.id}
              elevation={0}
              sx={{
                borderRadius: 3, // ✅ 더 둥글게
                px: 2,
                py: 2,
                backgroundColor: notif.read ? "#f9f9f9" : "#eeeeee",
                border: "1px solid #e0e0e0",
                transition: "all 0.2s ease",
                overflow: "hidden",
                "&:hover": {
                  backgroundColor: notif.read ? "#f0f0f0" : "#e5e5e5",
                },
              }}
            >
              <Stack spacing={1}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  gap={1}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    minWidth={0}
                    flex={1}
                  >
                    {/* ✅ 읽지 않은 알림이면 dot 표시 */}
                    {!notif.read && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#1a1a1a", // primary main
                          flexShrink: 0,
                        }}
                      />
                    )}

                    <Typography
                      variant="subtitle2"
                      fontWeight={500}
                      color="text.primary"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {notif.title}
                    </Typography>
                  </Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
                  >
                    {formatNotificationDate(notif.date)}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {notif.content}
                </Typography>
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
