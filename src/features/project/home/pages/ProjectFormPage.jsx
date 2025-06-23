import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectById,
  createProject,
  updateProject,
} from "@/features/project/slices/projectSlice";
import { fetchCompanyNamesByType } from "@/features/company/companySlice";
import { Button, Stack } from "@mui/material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import ProjectForm from "../components/ProjectForm";
import usePermission from "@/hooks/usePermission";

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
    step: "NOT_STARTED",
    startAt: "",
    endAt: "",
    devCompanyId: "",
    clientCompanyId: "",
  });

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
        step: current.step || "NOT_STARTED",
        startAt: current.startAt || "",
        endAt: current.endAt || "",
        devCompanyId: current.devCompanyId || "",
        clientCompanyId: current.clientCompanyId || "",
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
      };

      if (isEdit) {
        await dispatch(updateProject({ id: projectId, ...payload })).unwrap();
        navigate(`/projects/${projectId}`);
      } else {
        await dispatch(createProject(payload)).unwrap();
        navigate("/projects");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const headerAction = (
    <Stack direction="row" spacing={2}>
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
  );

  return (
    <PageWrapper>
      <PageHeader
        title={isEdit ? "프로젝트 수정" : "프로젝트 생성"}
        subtitle="새로운 프로젝트를 등록하여 업무 현황을 관리하세요."
        action={headerAction}
      />
      <ProjectForm
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={projectLoading}
        developerCompanies={devList}
        clientCompanies={clientList}
        isEdit={isEdit}
      />
    </PageWrapper>
  );
}
