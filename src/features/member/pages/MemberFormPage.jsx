// src/features/project/pages/ProjectFormPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Stack, CircularProgress } from "@mui/material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import MemberForm from '@/features/member/components/MemberForm';
import { createMember } from "@/api/member";
import {
  fetchAllCompanyNames,    // 추가
} from "@/features/company/companySlice";

const MemberFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { companyListOnlyIdName: companies = [], loading } =
    useSelector((state) => state.company);

  const [form, setForm] = useState({
    name: "",
    department: "",
    position: "",
    role: "",
    phoneNumber: "",
    email: "",
    birthDate: "",
    companyId: "",
  });

 // DEV / CLIENT 둘 다 불러오기
  useEffect(() => {
    dispatch(fetchAllCompanyNames());
  }, [dispatch]);

  // 각 필드 변경 핸들러
  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  // 제출 처리
  const handleSubmit = async () => {
    try {
      await createMember({
        ...form,
        birthDate: form.birthDate ? form.birthDate + 'T00:00:00' : ""
      });
      navigate("/members");
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
        disabled={
          loading ||
          !form.name ||
          !form.email ||
          !form.position ||
          !form.department ||
          !form.role ||
          !form.companyId ||
          !form.phoneNumber ||
          !form.birthDate
        }
      >
        {loading ? <CircularProgress size={24} /> : "등록"}
      </Button>
    </Stack>
  );

  return (
    <PageWrapper>
      <PageHeader
        title="멤버 등록"
        subtitle="새로운 멤버를 등록하여 팀을 구성하세요."
        action={headerAction}
      />
      <MemberForm
        form={form}
        handleChange={handleChange}
          companies={companies}
        loading={loading}
      />
    </PageWrapper>
  );
};

export default MemberFormPage;
