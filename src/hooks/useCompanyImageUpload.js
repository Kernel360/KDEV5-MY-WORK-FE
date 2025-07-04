import { useState } from "react";
import { validateFile } from "@/utils/validateFile";

export default function useCompanyImageUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, success, error
  const [error, setError] = useState(null);

  const handleImageSelect = (event) => {
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
    setUploadStatus("idle");

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

  const resetImageUpload = () => {
    handleImageDelete();
  };

  return {
    imageFile,
    previewUrl,
    uploadStatus,
    error,
    handleImageSelect,
    handleImageDelete,
    handleImageReplace,
    resetImageUpload,
  };
} 