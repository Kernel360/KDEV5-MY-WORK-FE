import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectById,
  createProject,
  updateProject,
} from "@/features/project/slices/projectSlice";
import { fetchCompanyNamesByType } from "@/features/company/companySlice";
import { createProjectStages } from "@/features/project/slices/projectStepSlice";
import { Button, Stack, Box } from "@mui/material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import ProjectForm from "../components/ProjectForm";
import usePermission from "@/hooks/usePermission";
import { v4 as uuidv4 } from "uuid";

export default function ProjectFormPage() {
  const { id: projectId } = useParams();
  const isEdit = Boolean(projectId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthorized, checked } = usePermission(["ROLE_SYSTEM_ADMIN"]);
  if (checked && !isAuthorized) return null;

  const { current, loading: projectLoading } = useSelector(
    (state) => state.project
  );
  const { companyByType = {}, loading: companyLoading } = useSelector(
    (state) => state.company
  );

  const devList = companyByType.DEV || [];
  const clientList = companyByType.CLIENT || [];

  const [form, setForm] = useState({
    name: "",
    detail: "",
    step: "CONTRACT",
    startAt: "",
    endAt: "",
    devCompanyId: "",
    clientCompanyId: "",
    projectAmount: "",
  });

  const [steps, setSteps] = useState([
    { projectStepId: uuidv4(), title: "기획", orderNumber: 1 },
    { projectStepId: uuidv4(), title: "분석", orderNumber: 2 },
    { projectStepId: uuidv4(), title: "설계", orderNumber: 3 },
  ]);

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchProjectById(projectId));
    }
  }, [dispatch, projectId, isEdit]);

  useEffect(() => {
    if (isEdit && current) {
      setForm({
        name: current.name || "",
        detail: current.detail || "",
        step: current.step || "CONTRACT",
        startAt: current.startAt || "",
        endAt: current.endAt || "",
        devCompanyId: current.devCompanyId || "",
        clientCompanyId: current.clientCompanyId || "",
        projectAmount: current.projectAmount || "",
      });
    }
  }, [isEdit, current]);

  useEffect(() => {
    dispatch(fetchCompanyNamesByType("DEV"));
    dispatch(fetchCompanyNamesByType("CLIENT"));
  }, [dispatch]);

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: form.name,
        detail: form.detail,
        step: form.step,
        deleted: false,
        devCompanyId: form.devCompanyId,
        clientCompanyId: form.clientCompanyId,
        ...(form.startAt && { startAt: `${form.startAt}T09:00:00` }),
        ...(form.endAt && { endAt: `${form.endAt}T18:00:00` }),
        ...(form.projectAmount && { projectAmount: parseInt(form.projectAmount) }),
      };

      if (isEdit) {
        await dispatch(updateProject({ id: projectId, ...payload })).unwrap();
        navigate(`/projects/${projectId}`);
      } else {
        // 1. 프로젝트 생성
        const res = await dispatch(createProject(payload)).unwrap();
        const newProjectId = res.projectId || res.id;
        // 2. 프로젝트 단계 생성
        await dispatch(
          createProjectStages({
            projectId: newProjectId,
            projectSteps: steps.map((s, idx) => ({
              title: s.title,
              orderNumber: idx + 1,
            })),
          })
        ).unwrap();
        navigate("/projects");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <PageWrapper>
      <PageHeader
        title={isEdit ? "프로젝트 수정" : "프로젝트 생성"}
        subtitle="새로운 프로젝트를 등록하여 업무 현황을 관리하세요."
      />
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
        <ProjectForm
          form={form}
          handleChange={handleChange}
          steps={steps}
          setSteps={setSteps}
          handleSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={projectLoading}
          developerCompanies={devList}
          clientCompanies={clientList}
          isEdit={isEdit}
        />
      </Box>

      <Stack
        direction="row"
        justifyContent="flex-end"
        spacing={2}
        sx={{ px: 3, mb: 4 }}
      >
        <Button variant="outlined" onClick={handleCancel}>
          취소
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={projectLoading || companyLoading || !form.name}
        >
          {projectLoading
            ? isEdit
              ? "로딩 중..."
              : "로딩 중..."
            : isEdit
              ? "저장"
              : "생성"}
        </Button>
      </Stack>
    </PageWrapper>
  );
}
