import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCompanyById,
  createCompany,
  updateCompany,
  createCompanyId,
} from "@/features/company/companySlice";
import { getCompanyImageDownloadUrl } from "@/api/company";
import { Box, Button, Stack } from "@mui/material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import PageHeader from "@/components/layouts/pageHeader/PageHeader";
import CompanyForm from "../components/CompanyForm";
import AlertMessage from "@/components/common/alertMessage/AlertMessage";
import useCompanyImageUpload from "@/hooks/useCompanyImageUpload";

/**
 * 회사 생성/수정 페이지 컴포넌트
 * - 회사 기본 정보 입력 및 수정
 * - 로고 이미지 S3 업로드 기능
 * - 생성 모드: 새 회사 등록
 * - 수정 모드: 기존 회사 정보 수정
 */
export default function CompanyFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { current, loading: companyLoading } = useSelector(
    (state) => state.company
  );

  // 회사 정보 폼 상태 관리
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

  // UI 상태 관리
  const [isSubmitted, setIsSubmitted] = useState(false); // 폼 제출 여부
  const [alertOpen, setAlertOpen] = useState(false); // 에러 알림 표시
  const [alertMessage, setAlertMessage] = useState(""); // 에러 메시지
  const [existingImageUrl, setExistingImageUrl] = useState(null); // 기존 이미지 미리보기 URL

  // 이미지 업로드 관련 훅
  // - 이미지 파일 선택, 미리보기, 업로드 상태 관리
  // - S3 presigned URL을 통한 업로드/삭제 기능 제공
  const {
    imageFile,
    previewUrl,
    uploadStatus,
    error: imageError,
    uploadedImageUrl,
    handleImageSelect: originalHandleImageSelect,
    handleImageDelete: originalHandleImageDelete,
    handleImageDeleteFromServer,
    handleImageDeleteFromServerOnly,
    handleImageUpload,
    resetImageUpload,
  } = useCompanyImageUpload();

  /**
   * 회사 생성 모드일 때 고유 ID 생성
   * - 생성 모드에서만 실행 (수정 모드에서는 URL 파라미터로 ID 전달)
   * - 서버에서 UUID 형태의 회사 ID 생성 후 폼 상태에 저장
   */
  useEffect(() => {
    const generateNewCompanyId = async () => {
      if (!isEdit) {
        try {
          const result = await dispatch(createCompanyId()).unwrap();
          setForm((prev) => ({ ...prev, id: result.data.companyId }));
        } catch (err) {
          // 에러 발생 시 별도 처리 없이 폼 상태만 유지
          // 이후 제출 시 서버에서 ID 생성 로직이 재시도됨
        }
      }
    };

    generateNewCompanyId();
  }, [dispatch, isEdit]);

  /**
   * 회사 수정 모드일 때 기존 회사 정보 조회
   * - 수정 모드에서만 실행 (URL 파라미터의 id 사용)
   * - 서버에서 회사 상세 정보 가져와서 Redux store에 저장
   */
  useEffect(() => {
    if (isEdit) {
      dispatch(fetchCompanyById(id));
    }
  }, [dispatch, id, isEdit]);

  /**
   * 조회된 회사 정보를 폼 상태에 반영
   * - 수정 모드에서 기존 데이터로 폼 필드 초기화
   * - 빈 값일 경우 기본값 설정 (type: "DEV")
   * - 로고 이미지 경로는 미리보기 표시를 위해 별도 처리
   */
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
      
      // 기존 로고 이미지가 있는 경우 다운로드 URL 발급 요청
      if (current.logoImagePath) {
        getCompanyImageDownloadUrl(current.companyId)
          .then((response) => {
            const downloadUrl = response.data.data.downloadUrl;
            setExistingImageUrl(downloadUrl);
          })
          .catch((error) => {
            console.error('이미지 다운로드 URL 발급 실패:', error);
          });
      }
    }
  }, [isEdit, current]);

  /**
   * 폼 필드 값 변경 처리
   * @param {string} key - 변경할 폼 필드 키
   * @returns {function} 이벤트 핸들러 함수
   */
  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  /**
   * 회사 정보 저장 처리
   * - 필수 값(회사명) 검증 후 서버에 저장
   * - 수정 모드: 기존 회사 정보 업데이트 후 상세 페이지로 이동
   * - 생성 모드: 새 회사 생성 후 회사 목록 페이지로 이동
   * - 에러 발생 시 사용자에게 알림 표시
   */
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
    }
  };

  /**
   * 취소 버튼 클릭 시 처리
   * - 이미지 업로드 상태 초기화
   * - 이전 페이지로 이동
   */
  const handleCancel = () => {
    resetImageUpload();
    navigate(-1);
  };

  /**
   * 이미지 삭제 처리
   * - 수정 모드: 기존 이미지 서버에서 삭제 (회사 ID 사용)
   * - 생성 모드: 임시 업로드된 이미지 서버에서 삭제 (폼 ID 사용)
   * - 로컬 상태: 서버에 업로드되지 않은 경우 로컬 상태만 초기화
   * - 에러 발생 시에도 UI 상태는 초기화하여 사용자 경험 개선
   */
  const handleImageDelete = async () => {
    try {
      // 수정 모드에서 기존 이미지가 서버에 있으면 서버에서 삭제
      if (isEdit && form.logoImagePath && id) {
        await handleImageDeleteFromServer(id);
      } else if (!isEdit && form.logoImagePath && form.id) {
        // 생성 모드에서 기존 이미지가 서버에 있으면 서버에서 삭제
        await handleImageDeleteFromServer(form.id);
      } else {
        // 서버에 업로드되지 않은 경우 로컬 상태만 초기화
        originalHandleImageDelete();
      }
      
      // 폼에서 이미지 경로 제거
      setForm(prev => ({ ...prev, logoImagePath: "" }));
      // 기존 이미지 미리보기 초기화
      setExistingImageUrl(null);
      
    } catch (error) {
      // 에러가 발생해도 UI 상태는 초기화 (사용자 경험 개선)
      originalHandleImageDelete();
      setForm(prev => ({ ...prev, logoImagePath: "" }));
      // 기존 이미지 미리보기 초기화
      setExistingImageUrl(null);
    }
  };

  /**
   * 이미지 파일 선택 처리
   * - 파일 선택 시 즉시 미리보기 표시 및 업로드 시작
   * - 수정 모드: 이미 회사 ID가 있으므로 바로 업로드
   * - 생성 모드: 회사 ID 생성 대기 후 업로드 (최대 10초 대기)
   * - 기존 이미지가 있으면 먼저 삭제 후 새 이미지 업로드
   * 
   * @param {Event} event - 파일 선택 이벤트
   */
  const handleImageSelect = async (event) => {
    // 선택된 파일 정보 가져오기
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }
    
    // 기존 이미지 미리보기 초기화
    setExistingImageUrl(null);
    
    // 파일 검증 및 미리보기 설정
    await originalHandleImageSelect(event);
    
    // 수정 모드에서는 바로 업로드 (이미 회사 ID가 있음)
    if (isEdit && id) {
      performUploadWithDelete(file, id);
      return;
    }
    
    // 생성 모드에서 회사 ID가 없으면 생성 대기
    if (!form.id) {
      // 회사 ID가 생성될 때까지 주기적으로 확인
      const checkId = setInterval(() => {
        const currentFormId = form.id;
        if (currentFormId) {
          clearInterval(checkId);
          performUploadWithDelete(file, currentFormId);
        }
      }, 100);
      
      // 10초 후 타임아웃으로 무한 대기 방지
      setTimeout(() => {
        clearInterval(checkId);
      }, 10000);
      return;
    }
    
    // 생성 모드에서 회사 ID가 있으면 바로 업로드
    performUploadWithDelete(file, form.id);
  };

  /**
   * 단순 이미지 업로드 처리
   * - presigned URL 발급 후 S3에 직접 업로드
   * - 업로드 성공 시 폼 상태에 이미지 경로 저장
   * - 에러 발생 시 별도 처리 없이 훅에서 상태 관리
   * 
   * @param {File} file - 업로드할 이미지 파일
   * @param {string} companyId - 회사 고유 ID
   */
  const performUpload = async (file, companyId) => {
    try {
      const uploadedUrl = await handleImageUpload(file, companyId);
      
      // 업로드 성공 시 폼에 이미지 경로 저장
      setForm(prev => ({ ...prev, logoImagePath: uploadedUrl }));
    } catch (error) {
      // 에러 처리는 useCompanyImageUpload 훅에서 담당
    }
  };

  /**
   * 기존 이미지 삭제 후 새 이미지 업로드 처리
   * - 이미지 교체 시 사용되는 핵심 함수
   * - 1단계: 기존 이미지 서버에서 삭제 (미리보기는 유지)
   * - 2단계: 새 이미지 presigned URL 발급 후 S3 업로드
   * - 에러 발생 시 폼 상태 초기화로 일관성 유지
   * 
   * @param {File} file - 업로드할 새 이미지 파일
   * @param {string} companyId - 회사 고유 ID
   */
  const performUploadWithDelete = async (file, companyId) => {
    try {
      // 1단계: 기존 이미지가 있으면 서버에서 삭제 (미리보기 유지)
      if (form.logoImagePath) {
        await handleImageDeleteFromServerOnly(companyId);
        
        // 폼에서 기존 이미지 경로 제거
        setForm(prev => ({ ...prev, logoImagePath: "" }));
      }
      
      // 2단계: 새 이미지 업로드
      const uploadedUrl = await handleImageUpload(file, companyId);
      
      // 업로드 성공 시 폼에 새 이미지 경로 저장
      setForm(prev => ({ ...prev, logoImagePath: uploadedUrl }));
      
    } catch (error) {
      // 에러 발생 시 폼 상태 초기화로 일관성 유지
      setForm(prev => ({ ...prev, logoImagePath: "" }));
    }
  };

  // 저장 버튼 활성화 조건
  const isAllRequiredFilled =
    form.name && form.detail && form.businessNumber && form.address && form.contactPhoneNumber && form.contactEmail;
  // 벨리데이션 에러 체크 (CompanyForm에서 상태를 올릴 수도 있지만, 여기선 간단히 내부 상태로)
  const hasError = false; // 실제로는 CompanyForm에서 errorState prop으로 받아서 체크하는 게 더 견고함

  // 페이지 헤더 액션 버튼들
  const headerAction = (
    <Stack direction="row" spacing={2}>
      <Button variant="outlined" onClick={handleCancel}>
        취소
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={companyLoading || !isAllRequiredFilled || hasError}
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
          existingImagePath: isEdit && existingImageUrl ? existingImageUrl : null,
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
