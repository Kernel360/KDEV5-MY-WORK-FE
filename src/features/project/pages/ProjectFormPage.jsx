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
import { Box, Button, Stack } from "@mui/material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import ProjectForm from "../components/ProjectForm";

export default function ProjectFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux 상태 조회
  const { current, loading: projectLoading } = useSelector(
    (state) => state.project
  );
  const companies = useSelector((state) => state.company.data);
  const users = useSelector((state) => state.member.data);

  // 로컬 폼 상태
  const [form, setForm] = useState({
    title: "",
    status: "기획",
    startDate: "",
    endDate: "",
    assigneeId: "",
    developerId: "",
  });

  // 편집 모드일 때 기존 프로젝트 데이터 로드
  useEffect(() => {
    if (isEdit) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id, isEdit]);

  // current 데이터가 바뀌면 form 상태에 반영
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

  // 처음 마운트 시 담당자·개발사 목록 로드
  useEffect(() => {
    dispatch(fetchMembers());
    dispatch(fetchCompanies());
  }, [dispatch]);

  // 각 필드 변경 핸들러
  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  // 제출 처리
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
      // TODO: 에러 발생 시 스낵바/토스트 표시
    }
  };

  // 취소 시 뒤로 이동
  const handleCancel = () => {
    navigate(-1);
  };

  // 헤더 우측에 들어갈 버튼들
  const headerAction = (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" onClick={handleCancel}>
        취소
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={projectLoading || !form.title}
      >
        {projectLoading
          ? isEdit
            ? "로딩 중..."
            : "로딩 중..."
          : isEdit
            ? "수정 저장"
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
        companies={companies}
        users={users}
        isEdit={isEdit}
      />
    </PageWrapper>
  );
}
