// src/components/PostDetailTopSection.jsx
import React from "react";
import { Box, Typography, IconButton, Stack, Avatar } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import CustomButton from "@/components/common/customButton/CustomButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import EditIcon from "@mui/icons-material/Edit";
import { getStatusMeta, POST_APPROVAL_STATUS } from "@/utils/statusMaps";

export default function PostDetailTopSection({
  post,
  onDelete,
  onClose,
  onApprovalToggle,
  approval,
  onEdit,
}) {
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
            {post.companyName?.[0] || "?"}
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
                <Typography fontWeight={600}>{post.authorName}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <BusinessRoundedIcon
                  sx={{ fontSize: 16, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {post.companyName}
                </Typography>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
              <AccessTimeRoundedIcon
                sx={{ fontSize: 16, color: "text.secondary" }}
              />
              <Typography variant="caption" color="text.secondary">
                {post.createdAt}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          {post.title}
        </Typography>
        <CustomButton
          kind={approval === "APPROVED" ? "ghost-success" : "ghost"}
          size="small"
          onClick={onApprovalToggle}
          startIcon={
            approval === "APPROVED" ? (
              <CheckCircleIcon fontSize="small" />
            ) : (
              <HourglassBottomIcon fontSize="small" />
            )
          }
        >
          {getStatusMeta(approval, POST_APPROVAL_STATUS).label}
        </CustomButton>
      </Box>
    </>
  );
}
