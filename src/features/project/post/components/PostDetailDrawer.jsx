// src/components/common/postTable/PostDetailDrawer.jsx
import React, { useState } from "react";
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
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useTheme } from "@mui/material/styles";

export default function PostDetailDrawer({ open, post, onClose }) {
  const theme = useTheme();
  const [comment, setComment] = useState("");

const statusMap = {
  PENDING: { label: "검토 요청", color: "neutral" },
  APPROVED: { label: "검토 완료", color: "success" },
};

const stat = statusMap[post?.approval ?? "-"] 
            || { label: post?.approval ?? "-", color: "neutral" };

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
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          overflowY: "auto",
          bgcolor: theme.palette.background.paper,
        }}
      >
        {/* 헤더 */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Avatar에도 Optional Chaining 적용 */}
            <Avatar sx={{ width: 40, height: 40 }}>
              {post?.companyName?.[0] ?? "?"}
            </Avatar>
            <Box>
              <Stack direction="row" spacing={1} alignItems="baseline">
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {post?.authorName ?? "-"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {post?.companyName ?? "-"}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {post?.createdAt ?? "-"}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* 제목 + 상태 칩 */}
        <Box
          sx={{
            px: 3,
            pb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {post?.title ?? "-"}
          </Typography>
          <Chip
           label={stat?.label ?? "-"}
            size="medium"
            sx={{
              bgcolor: theme.palette.status?.[stat.color]?.bg,
              color:  theme.palette.status?.[stat.color]?.main,
              fontWeight: 600,
              py: 0.5,
              px: 1.5,
            }}
          />
        </Box>

        {/* 본문 */}
        <Box sx={{ px: 3, pb: 3 }}>
          <Typography
            variant="body1"
            sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
          >
            {post?.content ?? "-"}
          </Typography>

          {/* 댓글 입력 */}
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            댓글
          </Typography>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 3 }}>
            <ChatBubbleOutlineIcon color="action" sx={{ mt: 0.5 }} />
            <TextField
              fullWidth
              placeholder="댓글을 입력해 주세요."
              variant="outlined"
              size="small"
              multiline
              minRows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button variant="contained" size="small" disabled={!comment.trim()}>
              등록
            </Button>
          </Box>
        </Box>
      </Paper>
    </Drawer>
  );
}
