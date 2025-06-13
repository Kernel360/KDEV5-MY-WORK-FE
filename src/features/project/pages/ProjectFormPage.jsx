// src/features/project/pages/ProjectFormPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjectById,
  createProject,
  updateProject,
} from "@/features/project/projectSlice";
import { fetchCompanyNamesByType } from "@/features/company/companySlice";
import { Box, Button, Stack, CircularProgress } from "@mui/material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import ProjectForm from "../components/ProjectForm";

export default function ProjectFormPage() {
  const { id: projectId } = useParams();
  const isEdit = Boolean(projectId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux 상태 조회
  const { current, loading: projectLoading } = useSelector(
    (state) => state.project
  );
  const { companyByType = {}, loading: companyLoading } = useSelector(
    (state) => state.company
  );

  // DEV/CLIENT 타입별 리스트 분리
  const devList = companyByType.DEV || [];
  const clientList = companyByType.CLIENT || [];

  // 로컬 폼 상태: step 으로 통일
  const [form, setForm] = useState({
    name: "",
    detail: "",
    step: "NOT_STARTED",
    startAt: "",
    endAt: "",
    devCompanyId: "",
    clientCompanyId: "",
  });

  // 편집 모드일 때 기존 프로젝트 데이터 로드
  useEffect(() => {
    if (isEdit) {
      dispatch(fetchProjectById(projectId));
    }
  }, [dispatch, projectId, isEdit]);

  // current 데이터가 바뀌면 form 상태에 반영
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

  // 처음 마운트 시 개발사/고객사 목록 로드
  useEffect(() => {
    dispatch(fetchCompanyNamesByType("DEV"));
    dispatch(fetchCompanyNamesByType("CLIENT"));
  }, [dispatch]);

  // 각 필드 변경 핸들러
  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 제출 처리
  const handleSubmit = async () => {
    try {
      // payload: form 필드를 그대로 사용
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
        // updateProject thunk 에는 { id, ...payload } 객체 하나를 넘깁니다.
        await dispatch(updateProject({ id: projectId, ...payload })).unwrap();
        navigate(`/projects/${projectId}`);
      } else {
        await dispatch(createProject(payload)).unwrap();
        navigate("/projects");
      }
    } catch (err) {
      console.error(err);
      // TODO: 에러 시 UI 처리
    }
  };

  // 취소 시 뒤로 이동
  const handleCancel = () => {
    navigate(-1);
  };

  // 헤더 우측 버튼
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
