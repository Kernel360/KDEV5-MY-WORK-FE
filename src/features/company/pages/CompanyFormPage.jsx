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
import AlertMessage from "@/components/common/alertMessage/AlertMessage";
import useCompanyImageUpload from "@/hooks/useCompanyImageUpload";

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
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // 이미지 업로드 훅
  const {
    imageFile,
    previewUrl,
    uploadStatus,
    error: imageError,
    handleImageSelect: originalHandleImageSelect,
    handleImageDelete,
    handleImageReplace,
    resetImageUpload,
  } = useCompanyImageUpload();

  useEffect(() => {
    const generateNewCompanyId = async () => {
      if (!isEdit) {
        try {
          const result = await dispatch(createCompanyId()).unwrap();
          setForm((prev) => ({ ...prev, id: result.data.companyId }));
        } catch (err) {
          console.error("회사 ID 생성 실패:", err);
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
      
      // 기존 로고 이미지가 있으면 미리보기 설정
      if (current.logoImagePath) {
        // 실제로는 API에서 이미지 URL을 가져와야 하지만, 
        // 현재는 로고 이미지 경로만 표시
        // TODO: API 연동 시 실제 이미지 URL로 변경
      }
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
        navigate("/companies");
      }
    } catch (err) {
      const errorData = err?.error || err;
      if (
        errorData?.code === "ERROR_COMPANY06" &&
        errorData?.message
      ) {
        setAlertMessage(errorData.message);
        setAlertOpen(true);
      } else {
        setAlertMessage("업체 등록에 실패했습니다.");
        setAlertOpen(true);
      }
      console.error(err);
    }
  };

  const handleCancel = () => {
    resetImageUpload();
    navigate(-1);
  };

  const handleImageSelect = (event) => {
    // 수정 모드에서 기존 이미지가 있으면 대체
    if (isEdit && form.logoImagePath) {
      handleImageReplace(form.logoImagePath);
    }
    originalHandleImageSelect(event);
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
        imageUploadProps={{
          previewUrl,
          error: imageError,
          onSelect: handleImageSelect,
          onDelete: handleImageDelete,
          existingImagePath: isEdit && form.logoImagePath ? form.logoImagePath : null,
          isEdit,
        }}
      />
      <AlertMessage
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
        severity="error"
      />
    </PageWrapper>
  );
}
