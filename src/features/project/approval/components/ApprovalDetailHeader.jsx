// ApprovalDetailHeader.jsx
import React from "react";
import {
  Box,
  Stack,
  Typography,
  Avatar,
  IconButton,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import { useTheme } from "@mui/material";

export default function ApprovalDetailHeader({ checkList, onClose }) {
  const theme = useTheme();

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

  return (
    <>
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
                <Typography fontWeight={600}>{checkList.authorName}</Typography>
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
            <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
              <AccessTimeRoundedIcon
                sx={{ fontSize: 16, color: "text.secondary" }}
              />
              <Typography variant="caption" color="text.secondary">
                {checkList.createdAt}
              </Typography>
            </Stack>
          </Box>
        </Stack>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

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
    </>
  );
}
