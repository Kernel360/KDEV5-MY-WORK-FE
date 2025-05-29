// src/features/project/pages/ProjectFormPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectById,
  createProject,
  updateProject,
} from "@/features/project/projectSlice";
import { fetchCompanies } from "@/features/company/companySlice";
import { fetchMembers } from "@/features/member/memberSlice";
import {
  TextField,
  MenuItem,
  Button,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";

const statusOptions = ["기획", "디자인", "퍼블리싱", "개발", "검수", "완료"];

export default function ProjectFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { current, loading: projectLoading } = useSelector(
    (state) => state.project
  );
  const companies = useSelector((state) => state.company.data);
  const users = useSelector((state) => state.member.data);

  const [form, setForm] = useState({
    title: "",
    status: "기획",
    startDate: "",
    endDate: "",
    assigneeId: "",
    developerId: "",
  });

  // Load project for edit
  useEffect(() => {
    if (isEdit) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id, isEdit]);

  // Populate form when project loaded
  useEffect(() => {
    if (isEdit && current) {
      setForm({
        title: current.title || "",
        status: current.status || "기획",
        startDate: current.startDate?.split("T")[0] || "",
        endDate: current.endDate?.split("T")[0] || "",
        assigneeId: current.assigneeId || "",
        developerId: current.developerId || "",
      });
    }
  }, [isEdit, current]);

  // Load companies and members
  useEffect(() => {
    dispatch(fetchMembers());
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await dispatch(updateProject({ id, ...form })).unwrap();
        navigate(`/projects/${id}`);
      } else {
        await dispatch(createProject(form)).unwrap();
        navigate("/projects");
      }
    } catch (err) {
      console.error(err);
      // TODO: add toast/snackbar for error
    }
  };

  // Show spinner while loading project data
  if (isEdit && projectLoading) {
    return (
      <PageWrapper>
        <CircularProgress
          sx={{ position: "absolute", top: "50%", left: "50%" }}
        />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <PageHeader title={isEdit ? "프로젝트 수정" : "프로젝트 생성"} />
      <Paper sx={{ p: 4, mt: 2, borderRadius: 2, boxShadow: 2 }}>
        <Stack spacing={4}>
          <TextField
            label="프로젝트 이름"
            value={form.title}
            onChange={handleChange("title")}
            fullWidth
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="시작일"
              type="date"
              value={form.startDate}
              onChange={handleChange("startDate")}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="종료일"
              type="date"
              value={form.endDate}
              onChange={handleChange("endDate")}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>

          <TextField
            select
            label="상태"
            value={form.status}
            onChange={handleChange("status")}
            fullWidth
          >
            {statusOptions.map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="담당자"
            value={form.assigneeId}
            onChange={handleChange("assigneeId")}
            fullWidth
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="개발사"
            value={form.developerId}
            onChange={handleChange("developerId")}
            fullWidth
          >
            {companies.map((comp) => (
              <MenuItem key={comp.id} value={comp.id}>
                {comp.name}
              </MenuItem>
            ))}
          </TextField>

          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Button variant="outlined" onClick={() => navigate(-1)}>
              취소
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {isEdit ? "수정 저장" : "생성"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </PageWrapper>
  );
}
