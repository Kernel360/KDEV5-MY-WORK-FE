import { useState, useEffect } from "react";
import { validateFile } from "@/utils/validateFile";
import { uploadCompanyImage } from "@/utils/uploadCompanyImage";
import { deleteCompanyImage } from "@/api/company";

export default function useCompanyImageUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, success, error
  const [error, setError] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 파일 검증
    const errors = validateFile(file);
    if (errors.length > 0) {
      setError(errors.join(", "));
      return;
    }

    // 이미지 파일인지 확인
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setError(null);
    setImageFile(file);
    setUploadStatus("idle"); // 업로드 상태를 idle로 설정 (실제 업로드는 외부에서 처리)

    // 미리보기 URL 생성
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleImageDelete = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);
    setUploadStatus("idle");
    setError(null);
  };

  const handleImageReplace = (existingImagePath) => {
    // 기존 이미지를 새 이미지로 대체
    handleImageDelete();
    // TODO: API 연동 시 기존 이미지 삭제 로직 추가
  };

  const handleImageDeleteFromServer = async (companyId) => {
    if (!companyId) {
      console.log('handleImageDeleteFromServer: companyId 없음');
      return;
    }

    try {
      console.log('=== 서버에서 이미지 삭제 시작 ===');
      console.log('회사ID:', companyId);
      
      setUploadStatus("uploading"); // 삭제 중 상태 표시
      setError(null);

      await deleteCompanyImage(companyId);
      
      // 로컬 상태 초기화
      handleImageDelete();
      
      console.log('=== 서버에서 이미지 삭제 성공 ===');
      
    } catch (error) {
      console.error('서버에서 이미지 삭제 실패:', error);
      setError('이미지 삭제에 실패했습니다.');
      setUploadStatus("error");
      throw error;
    }
  };

  const handleImageDeleteFromServerOnly = async (companyId) => {
    if (!companyId) {
      console.log('handleImageDeleteFromServerOnly: companyId 없음');
      return;
    }

    try {
      console.log('=== 서버에서만 이미지 삭제 시작 ===');
      console.log('회사ID:', companyId);
      
      setUploadStatus("uploading"); // 삭제 중 상태 표시
      setError(null);

      await deleteCompanyImage(companyId);
      
      // 로컬 상태는 초기화하지 않음 (미리보기 유지)
      setUploadStatus("idle");
      
      console.log('=== 서버에서만 이미지 삭제 성공 ===');
      
    } catch (error) {
      console.error('서버에서 이미지 삭제 실패:', error);
      setError('이미지 삭제에 실패했습니다.');
      setUploadStatus("error");
      throw error;
    }
  };

  const handleImageUpload = async (file, companyId) => {
    if (!file || !companyId) {
      console.log('handleImageUpload: 파일 또는 companyId 없음', { file: file?.name, companyId });
      return;
    }

    try {
      console.log('handleImageUpload: 업로드 시작');
      setUploadStatus("uploading");
      setError(null);

      const uploadedUrl = await uploadCompanyImage(file, companyId, (progress) => {
        // 진행률 업데이트 (필요시)
        console.log(`업로드 진행률: ${progress}%`);
      });

      setUploadedImageUrl(uploadedUrl);
      setUploadStatus("success");
      console.log('handleImageUpload: 업로드 성공');
      return uploadedUrl;

    } catch (error) {
      console.error('handleImageUpload: 업로드 실패', error);
      setError(error.message);
      setUploadStatus("error");
      throw error;
    }
  };

  const resetImageUpload = () => {
    handleImageDelete();
  };

  // 성공 상태 자동 리셋
  useEffect(() => {
    if (uploadStatus === "success") {
      const timer = setTimeout(() => {
        setUploadStatus("idle");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus]);

  return {
    imageFile,
    previewUrl,
    uploadStatus,
    error,
    uploadedImageUrl,
    handleImageSelect,
    handleImageDelete,
    handleImageDeleteFromServer,
    handleImageDeleteFromServerOnly,
    handleImageReplace,
    handleImageUpload,
    resetImageUpload,
  };
} 