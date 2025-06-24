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
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import CommentSection from "./CommentSection";
import { fetchReviews } from "../reviewSlice";
import { deletePost } from "../postSlice";

export default function PostDetailDrawer({ open, post, onClose }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.review.items || []);

  useEffect(() => {
    if (open && post?.postId) {
      dispatch(fetchReviews({ postId: post.postId, page: 1 }));
    }
  }, [open, post, dispatch]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await dispatch(deletePost({ postId: post.postId })).unwrap();
      alert("삭제되었습니다.");
      onClose();
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  const statusMap = {
    PENDING: { label: "대기", color: "neutral" },
    APPROVED: { label: "완료", color: "success" },
  };
  const stat = statusMap[post?.approval] || {
    label: post?.approval ?? "-",
    color: "neutral",
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: "50vw" },
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
          p: 3,
          boxSizing: "border-box",
        }}
      >
        {post ? (
          <Stack spacing={3}>
            {/* 헤더 */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 40, height: 40 }}>
                  {post.companyName?.[0] || "?"}
                </Avatar>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Typography variant="subtitle1" fontWeight={600}>
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

              <Stack direction="row" spacing={1}>
                <IconButton onClick={handleDelete}>
                  <DeleteIcon />
                </IconButton>
                <IconButton onClick={onClose}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            </Box>

            {/* 제목 + 상태 */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" fontWeight={700}>
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

            {/* 내용 + 댓글 */}
            <Box>
              <Typography
                variant="body1"
                sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6, mb: 3 }}
              >
                {post.content}
              </Typography>
              <CommentSection postId={post.postId} comments={reviews} />
            </Box>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            데이터를 불러오는 중입니다...
          </Typography>
        )}
      </Paper>
    </Drawer>
  );
}
