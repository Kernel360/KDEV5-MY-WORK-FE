// src/components/common/postTable/PostDetailDrawer.jsx
import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  Chip,
  Divider,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import CommentSection from "./CommentSection";

export default function PostDetailDrawer({ open, post, onClose }) {
  const theme = useTheme();

  // post가 아직 로드되지 않았다면 렌더링하지 않음
  if (!post) return null;

  const statusMap = {
    PENDING: { label: "검토 요청", color: "neutral" },
    APPROVED: { label: "검토 완료", color: "success" },
  };
  const stat = statusMap[post.approval] || { label: post.approval ?? "-", color: "neutral" };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: "50vw" }, bgcolor: "transparent" } }}
    >
      <Paper
        elevation={6}
        sx={{
          height: "100%",
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          overflowY: "auto",
          bgcolor: theme.palette.background.paper,
        }}
      >
        {/* 헤더 */}
        <Box sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 40, height: 40 }}>{post.companyName?.[0] || "?"}</Avatar>
            <Box>
              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{post.authorName}</Typography>
                <Typography variant="body2" color="text.secondary">{post.companyName}</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">{post.createdAt}</Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 제목 + 상태 칩 */}
        <Box sx={{ px: 3, pb: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{post.title}</Typography>
          <Chip
            label={stat.label}
            size="medium"
            sx={{
              bgcolor: theme.palette.status?.[stat.color]?.bg,
              color: theme.palette.status?.[stat.color]?.main,
              fontWeight: 600,
              py: 0.5,
              px: 1.5,
            }}
          />
        </Box>

        {/* 본문 */}
        <Box sx={{ px: 3, pb: 3 }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {post.content}
          </Typography>

          {/* 댓글 섹션 */}
          <CommentSection postId={post.postId} comments={post.reviews ?? []} />
        </Box>
      </Paper>
    </Drawer>
  );
}
