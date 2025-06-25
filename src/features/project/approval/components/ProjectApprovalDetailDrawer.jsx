import React, { useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  Chip,
  Avatar,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { useDispatch, useSelector } from "react-redux";
import {
  getCheckListByIdThunk,
  approveCheckListThunk,
} from "../checklistSlice";
import { useTheme, useMediaQuery } from "@mui/material";
import CustomButton from "@/components/common/customButton/CustomButton";

export default function ProjectApprovalDetailDrawer({
  open,
  checkListId,
  onClose,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { current: checkList, error } = useSelector((state) => state.checklist);

  useEffect(() => {
    if (open && checkListId) {
      dispatch(getCheckListByIdThunk(checkListId)).catch((err) =>
        console.error("조회 실패:", err)
      );
    }
  }, [open, checkListId, dispatch]);

  const approvalMap = {
    APPROVED: { label: "승인됨", color: "success" },
    PENDING: { label: "대기 중", color: "warning" },
    REJECTED: { label: "반려됨", color: "error" },
    UPDATE_REQUEST: { label: "수정 요청", color: "info" },
  };

  const status = approvalMap[checkList?.approval] || {
    label: checkList?.approval ?? "-",
    color: "default",
  };

  const handleApprove = async (approvalType) => {
    try {
      await dispatch(
        approveCheckListThunk({
          checklistId: checkList.checkListId,
          data: { approval: approvalType },
        })
      ).unwrap();
      onClose();
    } catch (err) {
      console.error("결재 처리 실패", err);
      alert("처리 실패");
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : "50vw",
          bgcolor: "transparent",
        },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          height: "100%",
          borderTopLeftRadius: 2,
          borderBottomLeftRadius: 2,
          overflowY: "auto",
          bgcolor: theme.palette.background.paper,
          p: 4,
          boxSizing: "border-box",
        }}
      >
        {checkList ? (
          <Stack spacing={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 40, height: 40 }}>
                  {checkList.companyName?.[0] || "?"}
                </Avatar>
                <Box>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    flexWrap="wrap"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <AccountCircleRoundedIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography fontWeight={600}>
                        {checkList.authorName}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <BusinessRoundedIcon
                        sx={{ fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {checkList.companyName}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    mt={0.5}
                  >
                    <AccessTimeRoundedIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {checkList.createdAt}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            </Box>

            {/* 제목 */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" fontWeight={700}>
                {checkList.title}
              </Typography>
              <Chip
                label={status.label}
                size="medium"
                sx={{
                  bgcolor: theme.palette.status?.[status.color]?.bg,
                  color: theme.palette.status?.[status.color]?.main,
                  fontWeight: 600,
                  py: 0.5,
                  px: 1.5,
                }}
              />
            </Box>

            {/* 본문 */}
            <Box
              sx={{
                p: 2,
                bgcolor: theme.palette.grey[50],
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body1"
                sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
              >
                {checkList.content}
              </Typography>
            </Box>

            {/* 버튼 (PENDING 상태일 때만 표시) */}
            {checkList.approval === "PENDING" && (
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <CustomButton
                  kind="ghost-success"
                  size="small"
                  onClick={() => handleApprove("APPROVED")}
                >
                  승인
                </CustomButton>
                <CustomButton
                  kind="ghost-danger"
                  size="small"
                  onClick={() => handleApprove("REJECTED")}
                >
                  반려
                </CustomButton>
                <CustomButton
                  kind="ghost-info"
                  size="small"
                  onClick={() => handleApprove("UPDATE_REQUEST")}
                >
                  수정 요청
                </CustomButton>
              </Stack>
            )}
          </Stack>
        ) : error ? (
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <Typography variant="body2" color="text.secondary">
              항목을 불러올 수 없습니다.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <CircularProgress />
          </Box>
        )}
      </Paper>
    </Drawer>
  );
}
