// src/features/project/pages/ProjectFormPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompanyById,
  createCompany,
  updateCompany,
  createCompanyId,
} from "@/features/company/companySlice";
import { Box, Button, Stack } from "@mui/material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import DevCompanyForm from "../components/DevCompanyForm";

export default function DevCompanyFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux 상태 조회
  const { current, loading: companyLoading } = useSelector(
    (state) => state.company
  );

  // 로컬 폼 상태
  const [form, setForm] = useState({
    id: "",
    name: "",
    detail: "",
    businessNumber: "",
    address: "",
    type: "DEV",
    contactPhoneNumber: "",
    contactEmail: "",
    logoImagePath: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // 새로운 회사 ID 생성 및 localStorage 저장
  useEffect(() => {
    const generateNewCompanyId = async () => {
      if (!isEdit) {
        console.log("회사 ID 생성 시작 - isEdit:", isEdit);
        const storedId = localStorage.getItem("newCompanyId");
        console.log("저장된 ID:", storedId);
        if (!storedId) {
          try {
            console.log("새로운 회사 ID 생성 요청");
            const result = await dispatch(createCompanyId()).unwrap();
            console.log("회사 ID 생성 결과:", result);
            localStorage.setItem("newCompanyId", result.data.companyId);
            console.log("local storage:", localStorage.getItem("newCompanyId"));
            setForm((prev) => ({ ...prev, id: result.data.companyId }));
          } catch (err) {
            console.error("회사 ID 생성 실패:", err);
          }
        } else {
          setForm((prev) => ({ ...prev, id: storedId }));
        }
      }
    };

    generateNewCompanyId();
  }, [dispatch, isEdit]);

  // 편집 모드일 때 기존 회사 데이터 로드
  useEffect(() => {
    if (isEdit) {
      dispatch(fetchCompanyById(id));
    }
  }, [dispatch, id, isEdit]);

  // current 데이터가 바뀌면 form 상태에 반영
  useEffect(() => {
    if (isEdit && current) {
      setForm({
        id: current.id || null,
        name: current.name || "",
        detail: current.detail || "",
        businessNumber: current.businessNumber || "",
        address: current.address || "",
        type: current.type || "DEV",
        contactPhoneNumber: current.contactPhoneNumber || "",
        contactEmail: current.contactEmail || "",
        logoImagePath: current.logoImagePath || "",
      });
    }
  }, [isEdit, current]);

  // 각 필드 변경 핸들러
  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  // 제출 처리
  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (!form.name) return;

    try {
      if (isEdit) {
        await dispatch(updateCompany({ id, ...form })).unwrap();
        navigate(`/dev-companies/${id}`);
      } else {
        await dispatch(createCompany(form)).unwrap();
        localStorage.removeItem("newCompanyId"); // 성공적으로 생성 후 localStorage에서 제거
        navigate("/dev-companies");
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
        disabled={companyLoading || !form.name}
      >
        {companyLoading ? "로딩 중..." : isEdit ? "수정 저장" : "생성"}
      </Button>
    </Stack>
  );

  return (
    <PageWrapper>
      <PageHeader
        title={isEdit ? "개발사 수정" : "개발사 생성"}
        subtitle="새로운 개발사를 등록해주세요."
        action={headerAction}
      />

      <DevCompanyForm
        form={form}
        handleChange={handleChange}
        isEdit={isEdit}
        isSubmitted={isSubmitted}
      />
    </PageWrapper>
  );
}
