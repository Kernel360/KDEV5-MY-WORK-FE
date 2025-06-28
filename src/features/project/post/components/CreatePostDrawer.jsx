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
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { InfoOutlined } from "@mui/icons-material";
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
        await onSubmit(payload);
      } else {
        await dispatch(createPost({ projectId, data: payload })).unwrap();
      }

      localStorage.removeItem("newPostId");
      setForm({ id: "", projectStepId: "", title: "", content: "" });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm((prev) => ({ ...prev, projectStepId: "", title: "", content: "" }));
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleCancel}
      PaperProps={{
        sx: { width: { xs: "100%", sm: "50vw" }, bgcolor: "transparent" },
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
        <Stack spacing={4} sx={{ flex: 1 }}>
          {/* 헤더 */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mx: 0,
                px: 0,
              }}
            >
              <Typography variant="h3" fontWeight={600}>
                게시글 작성
              </Typography>
              <IconButton onClick={handleCancel}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mt: 1 }} />
          </Box>

          {loadingId || loading ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    1. 단계 선택
                  </Typography>
                  <Tooltip title="해당 게시글이 속할 단계를 선택하세요.">
                    <InfoOutlined fontSize="small" color="action" />
                  </Tooltip>
                </Stack>
                <Divider sx={{ mt: 1, mb: 2 }} />

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
                        ? projectSteps.find((s) => s.projectStepId === val)
                            ?.title
                        : "단계를 선택하세요"
                    }
                  >
                    <MenuItem value="" disabled>
                      단계 선택
                    </MenuItem>
                    {projectSteps.map((step) => (
                      <MenuItem
                        key={step.projectStepId}
                        value={step.projectStepId}
                      >
                        {step.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    2. 제목 입력
                  </Typography>
                  <Tooltip title="게시글 제목을 입력하세요.">
                    <InfoOutlined fontSize="small" color="action" />
                  </Tooltip>
                </Stack>
                <Divider sx={{ mt: 1, mb: 2 }} />

                <TextField
                  label="제목"
                  placeholder="제목을 입력하세요"
                  value={form.title}
                  onChange={handleChange("title")}
                  fullWidth
                  size="small"
                />
              </Box>

              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    3. 내용 입력
                  </Typography>
                  <Tooltip title="게시글 내용을 입력하세요.">
                    <InfoOutlined fontSize="small" color="action" />
                  </Tooltip>
                </Stack>
                <Divider sx={{ mt: 1, mb: 2 }} />

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
              </Box>

              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button variant="text" onClick={handleCancel}>
                  취소
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "등록 중…" : "등록"}
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </Paper>
    </Drawer>
  );
}
