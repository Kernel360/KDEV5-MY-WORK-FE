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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { InfoOutlined } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createCheckListThunk } from "../checklistSlice";
import CustomButton from "@/components/common/customButton/CustomButton";
import { fetchProjectStages } from "@/features/project/slices/projectStepSlice";

export default function CreateCheckListDrawer({ open, onClose, onSubmit }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { id: projectId } = useParams();

  const projectSteps = useSelector((state) => state.projectStep.items) || [];

  const [form, setForm] = useState({
    title: "",
    content: "",
    projectStepId: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectStages(projectId));
    }
  }, [dispatch, projectId]);

  const handleChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async () => {
    const { title, content, projectStepId } = form;
    if (!projectStepId || !title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      await dispatch(
        createCheckListThunk({ ...form, approval: "PENDING" })
      ).unwrap();

      setForm({ title: "", content: "", projectStepId: "" });

      // ✅ onSubmit 콜백 호출 (리스트 리프레시 + drawer 닫기)
      if (onSubmit) onSubmit();
      else onClose();
    } catch (e) {
      console.error("체크리스트 생성 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ title: "", content: "", projectStepId: "" });
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
              }}
            >
              <Typography variant="h3" fontWeight={600}>
                체크리스트 작성
              </Typography>
              <IconButton onClick={handleCancel}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mt: 1 }} />
          </Box>

          {loading ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* 단계 선택 */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    1. 단계 선택
                  </Typography>
                  <Tooltip title="체크리스트가 속할 단계를 선택하세요.">
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

              {/* 제목 */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    2. 제목 입력
                  </Typography>
                  <Tooltip title="체크리스트 제목을 입력하세요.">
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

              {/* 내용 */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    3. 내용 입력
                  </Typography>
                  <Tooltip title="체크리스트 내용을 입력하세요.">
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

              {/* 버튼 */}
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <CustomButton variant="ghost" onClick={handleCancel}>
                  취소
                </CustomButton>
                <CustomButton
                  variant="primary"
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={
                    !form.projectStepId ||
                    !form.title.trim() ||
                    !form.content.trim()
                  }
                >
                  등록
                </CustomButton>
              </Stack>
            </>
          )}
        </Stack>
      </Paper>
    </Drawer>
  );
}
