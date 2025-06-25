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
import CompanyForm from "../components/CompanyForm";

export default function CompanyFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { current, loading: companyLoading } = useSelector(
    (state) => state.company
  );

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

  useEffect(() => {
    const generateNewCompanyId = async () => {
      if (!isEdit) {
        const storedId = localStorage.getItem("newCompanyId");
        if (!storedId) {
          try {
            const result = await dispatch(createCompanyId()).unwrap();
            localStorage.setItem("newCompanyId", result.data.companyId);
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

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchCompanyById(id));
    }
  }, [dispatch, id, isEdit]);

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

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    if (!form.name) return;

    try {
      const payload = { ...form, id: id };
      if (isEdit) {
        await dispatch(updateCompany(payload)).unwrap();
        navigate(`/companies/${id}`);
      } else {
        await dispatch(createCompany(form)).unwrap();
        localStorage.removeItem("newCompanyId");
        navigate("/companies");
      }
    } catch (err) {
      console.error(err);
      // TODO: 에러 발생 시 스낵바/토스트 표시
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
        disabled={companyLoading || !form.name}
      >
        {companyLoading ? "로딩 중..." : isEdit ? "수정 저장" : "등록"}
      </Button>
    </Stack>
  );

  return (
    <PageWrapper>
      <PageHeader
        title={isEdit ? "업체 수정" : "업체 등록"}
        subtitle="새로운 업체를 등록해주세요."
        action={headerAction}
      />

      <CompanyForm
        form={form}
        handleChange={handleChange}
        isEdit={isEdit}
        isSubmitted={isSubmitted}
      />
    </PageWrapper>
  );
}
