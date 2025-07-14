import { useState, useEffect } from "react";
import { validateFile } from "@/utils/validateFile";
import { uploadCompanyImage } from "@/utils/uploadCompanyImage";
import { deleteCompanyImage } from "@/api/company";

/**
 * 회사 이미지 업로드 관련 훅
 * - 이미지 파일 선택, 검증, 미리보기 관리
 * - S3 업로드 상태 및 에러 처리
 * - 서버 이미지 삭제 기능 제공
 * 
 * @returns {Object} 이미지 업로드 관련 상태 및 핸들러 함수들
 */
export default function useCompanyImageUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle"); // idle, uploading, success, error
  const [error, setError] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  /**
   * 이미지 파일 선택 및 검증 처리
   * - 파일 형식 및 크기 검증
   * - 미리보기 URL 생성
   * - 실제 업로드는 외부에서 별도 처리
   * 
   * @param {Event} event - 파일 선택 이벤트
   * @returns {boolean} 검증 성공 여부
   */
  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return false;

    // 파일 검증
    const errors = validateFile(file);
    if (errors.length > 0) {
      setError(errors.join(", "));
      return false;
    }

    // 이미지 파일인지 확인
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다.");
      return false;
    }

    setError(null);
    setImageFile(file);
    setUploadStatus("idle"); // 업로드 상태를 idle로 설정 (실제 업로드는 외부에서 처리)

    // 미리보기 URL 생성
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    return true;
  };

  /**
   * 로컬 이미지 상태 초기화
   * - 미리보기 URL 메모리 해제
   * - 파일 참조 및 상태 초기화
   * - 서버 이미지는 삭제하지 않음
   */
  const handleImageDelete = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);
    setUploadStatus("idle");
    setError(null);
  };

  /**
   * 기존 이미지 교체 처리
   * - 현재는 로컬 상태만 초기화
   * - 실제 서버 이미지 삭제는 performUploadWithDelete에서 처리
   * 
   * @param {string} existingImagePath - 기존 이미지 경로 (현재 미사용)
   */
  const handleImageReplace = (existingImagePath) => {
    // 기존 이미지를 새 이미지로 대체
    handleImageDelete();
    // 서버 이미지 삭제는 별도 함수에서 처리
  };

  /**
   * 서버에서 이미지 삭제 및 로컬 상태 초기화
   * - S3에서 이미지 파일 완전 삭제
   * - 로컬 상태(미리보기, 파일 참조) 모두 초기화
   * - 삭제 버튼 클릭 시 사용
   * 
   * @param {string} companyId - 회사 고유 ID
   */
  const handleImageDeleteFromServer = async (companyId) => {
    if (!companyId) {
      return;
    }

    try {
      setUploadStatus("uploading"); // 삭제 중 상태 표시
      setError(null);

      await deleteCompanyImage(companyId);
      
      // 로컬 상태 초기화
      handleImageDelete();
      
    } catch (error) {
      setError('이미지 삭제에 실패했습니다.');
      setUploadStatus("error");
      throw error;
    }
  };

  /**
   * 서버에서만 이미지 삭제 (로컬 상태 유지)
   * - S3에서 이미지 파일만 삭제
   * - 로컬 상태(미리보기, 파일 참조) 유지
   * - 이미지 교체 시 기존 이미지 삭제 용도
   * 
   * @param {string} companyId - 회사 고유 ID
   */
  const handleImageDeleteFromServerOnly = async (companyId) => {
    if (!companyId) {
      return;
    }

    try {
      setUploadStatus("uploading"); // 삭제 중 상태 표시
      setError(null);

      await deleteCompanyImage(companyId);
      
      // 로컬 상태는 초기화하지 않음 (미리보기 유지)
      setUploadStatus("idle");
      
    } catch (error) {
      setError('이미지 삭제에 실패했습니다.');
      setUploadStatus("error");
      throw error;
    }
  };

  /**
   * 이미지 파일 S3 업로드 처리
   * - presigned URL 발급 후 S3에 직접 업로드
   * - 업로드 진행률 및 상태 관리
   * - 성공 시 업로드된 이미지 URL 반환
   * 
   * @param {File} file - 업로드할 이미지 파일
   * @param {string} companyId - 회사 고유 ID
   * @returns {Promise<string>} 업로드된 이미지 URL
   */
  const handleImageUpload = async (file, companyId) => {
    if (!file || !companyId) {
      return;
    }

    try {
      setUploadStatus("uploading");
      setError(null);

      const uploadedUrl = await uploadCompanyImage(file, companyId, (progress) => {
        // 진행률 업데이트 (필요시 추가 처리 가능)
      });

      setUploadedImageUrl(uploadedUrl);
      setUploadStatus("success");
      return uploadedUrl;

    } catch (error) {
      setError(error.message);
      setUploadStatus("error");
      throw error;
    }
  };

  /**
   * 이미지 업로드 상태 완전 초기화
   * - 페이지 이동 시 정리용
   * - handleImageDelete와 동일한 기능
   */
  const resetImageUpload = () => {
    handleImageDelete();
  };

  /**
   * 업로드 성공 상태 자동 리셋
   * - 성공 메시지 2초 후 자동 숨김
   * - 사용자 경험 개선을 위한 UI 상태 관리
   */
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