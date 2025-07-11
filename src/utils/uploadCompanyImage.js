import { getCompanyImageUploadUrl } from "@/api/company";

/**
 * 회사 이미지 S3 업로드 처리
 * - 1단계: 서버에 presigned URL 발급 요청
 * - 2단계: 발급받은 URL로 S3에 직접 업로드
 * - 3단계: 업로드 완료 후 실제 이미지 URL 반환
 * 
 * @param {File} file - 업로드할 이미지 파일
 * @param {string} companyId - 회사 UUID
 * @param {Function} onProgress - 진행률 콜백 (0-100)
 * @returns {Promise<string>} 업로드된 이미지 URL
 */
export async function uploadCompanyImage(file, companyId, onProgress) {
  try {
    // 1단계: Presigned URL 발급
    const response = await getCompanyImageUploadUrl(companyId, file.name);
    const uploadUrl = response.data.data.uploadUrl;

    // 2단계: S3에 직접 파일 업로드
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error(`업로드 실패: ${uploadResponse.status} - ${uploadResponse.statusText}`);
    }

    // 3단계: 업로드된 이미지 URL 반환 (presigned URL에서 실제 URL 추출)
    const uploadedUrl = uploadUrl.split('?')[0];
    return uploadedUrl;

  } catch (error) {
    throw new Error('이미지 업로드에 실패했습니다.');
  }
} 