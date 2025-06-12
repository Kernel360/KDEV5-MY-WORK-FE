// src/components/common/postTable/PostDetailDrawer.jsx
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import CommentSection from "./CommentSection";
import { fetchReviews } from "../reviewSlice"; // 경로는 실제 위치에 맞춰 조정

export default function PostDetailDrawer({ open, post, onClose }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const reviews = useSelector(
    state => state.review.items || []
  );

  console.log('reviews', reviews)

  // drawer가 열릴 때 postId가 있으면 댓글 조회
  useEffect(() => {
    if (open && post?.postId) {
      dispatch(fetchReviews({ postId: post.postId, page: 1 }));
    }
  }, [open, post, dispatch]);

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
            <Avatar sx={{ width: 40, height: 40 }}>
              {post.companyName?.[0] || "?"}
            </Avatar>
            <Box>
              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {post.authorName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.companyName}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {post.createdAt}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 제목 + 상태 칩 */}
        <Box sx={{ px: 3, pb: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {post.title}
          </Typography>
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

        {/* 본문 + 댓글 */}
        <Box sx={{ px: 3, pb: 3 }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {post.content}
          </Typography>
          <CommentSection postId={post.postId} comments={reviews} />
        </Box>
      </Paper>
    </Drawer>
  );
}
