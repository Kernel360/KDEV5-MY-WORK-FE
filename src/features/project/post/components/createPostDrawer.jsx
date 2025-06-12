// src/components/common/postTable/CreatePostDrawer.jsx
import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Paper,
  Divider,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createPostId, createPost } from "@/features/project/post/postSlice";

export default function CreatePostDrawer({ open, onClose, onSubmit }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { id: projectId } = useParams();

  const userName = useSelector((state) => state.auth.user.name);
  const companyName = useSelector((state) => state.auth.company.name);
  const projectSteps = useSelector((state) => state.projectStep.items) || [];

  const [form, setForm] = useState({
    id: "",
    projectStepId: "",
    title: "",
    content: "",
  });
  const [loadingId, setLoadingId] = useState(false);
  const [loading, setLoading] = useState(false);

  // 새 글 ID 생성
  useEffect(() => {
    const generateNewPostId = async () => {
      const storedId = localStorage.getItem("newPostId");
      if (!storedId) {
        try {
          setLoadingId(true);
          const result = await dispatch(createPostId()).unwrap();
          const newId = typeof result === "string" ? result : result.postId;
          localStorage.setItem("newPostId", newId);
          setForm((prev) => ({ ...prev, id: newId }));
        } catch (err) {
          console.error("Post ID 생성 실패:", err);
        } finally {
          setLoadingId(false);
        }
      } else {
        setForm((prev) => ({ ...prev, id: storedId }));
      }
    };

    generateNewPostId();
  }, [dispatch, open]);

  const handleChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  // 등록 처리
  const handleSubmit = async () => {
    const { id, projectStepId, title, content } = form;
    if (!projectStepId || !title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const payload = {
        id,
        projectStepId,
        title,
        content,
        companyName,
        authorName: userName,
      };

      if (onSubmit) {
        // 부모 컴포넌트가 createPost를 처리하도록 위임
        await onSubmit(payload);
      } else {
        // 자체적으로 dispatch
        await dispatch(createPost({ projectId, data: payload })).unwrap();
      }

      // 완료 후 초기화
      localStorage.removeItem("newPostId");
      setForm({ id: "", projectStepId: "", title: "", content: "" });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: "100%", sm: "50vw" }, bgcolor: "transparent" },
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
        <Box sx={{ p: 3, display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={700}>
            새 게시글 작성
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <Box sx={{ px: 3, py: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          {(loadingId || loading) ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <FormControl fullWidth size="small">
                <InputLabel id="step-select-label">단계</InputLabel>
                <Select
                  labelId="step-select-label"
                  value={form.projectStepId}
                  label="단계"
                  onChange={handleChange("projectStepId")}
                  displayEmpty
                  renderValue={(val) =>
                    val
                      ? projectSteps.find((s) => s.projectStepId === val)?.title
                      : "단계를 선택하세요"
                  }
                >
                  <MenuItem value="" disabled>
                    단계 선택
                  </MenuItem>
                  {projectSteps.map((step) => (
                    <MenuItem key={step.projectStepId} value={step.projectStepId}>
                      {step.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="제목"
                placeholder="제목을 입력하세요"
                value={form.title}
                onChange={handleChange("title")}
                fullWidth
                size="small"
              />

              <TextField
                label="내용"
                placeholder="내용을 입력하세요"
                value={form.content}
                onChange={handleChange("content")}
                fullWidth
                multiline
                minRows={6}
                size="small"
              />

              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="text" onClick={onClose}>
                  취소
                </Button>
                <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                  {loading ? "등록 중…" : "등록"}
                </Button>
              </Stack>
            </>
          )}
        </Box>
      </Paper>
    </Drawer>
  );
}
