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
    uploadedImageUrl,
    handleImageSelect: originalHandleImageSelect,
    handleImageDelete: originalHandleImageDelete,
    handleImageDeleteFromServer,
    handleImageReplace,
    handleImageUpload,
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

  const handleImageDelete = async () => {
    try {
      // 기존 이미지가 서버에 있으면 서버에서 삭제
      if (form.logoImagePath && form.id) {
        console.log('서버에서 이미지 삭제 시도:', form.id);
        await handleImageDeleteFromServer(form.id);
      } else {
        // 서버에 업로드되지 않은 경우 로컬 상태만 초기화
        console.log('로컬 상태만 초기화');
        originalHandleImageDelete();
      }
      
      // 폼에서 이미지 경로 제거
      setForm(prev => ({ ...prev, logoImagePath: "" }));
      console.log('이미지 삭제 완료');
      
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      // 에러가 발생해도 UI 상태는 초기화 (사용자 경험 개선)
      originalHandleImageDelete();
      setForm(prev => ({ ...prev, logoImagePath: "" }));
    }
  };

  const handleImageSelect = async (event) => {
    // 수정 모드에서 기존 이미지가 있으면 대체
    if (isEdit && form.logoImagePath) {
      handleImageReplace(form.logoImagePath);
    }
    
    // 파일 정보를 먼저 가져오기
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }
    
    await originalHandleImageSelect(event);
    
    // 회사 ID가 없으면 생성 대기
    if (!form.id) {
      console.log('회사 ID가 없어서 업로드 대기');
      // 회사 ID가 생성될 때까지 대기
      const checkId = setInterval(() => {
        const currentFormId = form.id;
        if (currentFormId) {
          clearInterval(checkId);
          console.log('회사 ID 생성됨:', currentFormId);
          performUpload(file, currentFormId);
        }
      }, 100);
      
      // 10초 후 타임아웃
      setTimeout(() => {
        clearInterval(checkId);
        console.error('회사 ID 생성 타임아웃');
      }, 10000);
      return;
    }
    
    // 바로 업로드 수행
    console.log('회사 ID 있음, 바로 업로드:', form.id);
    performUpload(file, form.id);
  };

  const performUpload = async (file, companyId) => {
    try {
      console.log('=== 이미지 업로드 시작 ===');
      console.log('파일명:', file.name);
      console.log('파일크기:', file.size);
      console.log('파일타입:', file.type);
      console.log('회사ID:', companyId);
      
      const uploadedUrl = await handleImageUpload(file, companyId);
      console.log('업로드 성공, URL:', uploadedUrl);
      
      // 업로드 성공 시 폼에 이미지 경로 저장
      setForm(prev => ({ ...prev, logoImagePath: uploadedUrl }));
      console.log('폼에 이미지 경로 저장됨');
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    }
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
          uploadStatus,
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
