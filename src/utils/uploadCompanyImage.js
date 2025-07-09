import { getCompanyImageUploadUrl } from "@/api/company";

/**
 * 회사 이미지 업로드
 * @param {File} file - 업로드할 이미지 파일
 * @param {string} companyId - 회사 UUID
 * @param {Function} onProgress - 진행률 콜백 (0-100)
 * @returns {Promise<string>} 업로드된 이미지 URL
 */
export async function uploadCompanyImage(file, companyId, onProgress) {
  try {
    console.log('=== uploadCompanyImage 시작 ===');
    console.log('파일명:', file.name);
    console.log('회사ID:', companyId);
    
    // 1. Presigned URL 발급
    console.log('1단계: Presigned URL 발급 요청...');
    console.log('요청 데이터:', { companyId, fileName: file.name });
    const response = await getCompanyImageUploadUrl(companyId, file.name);
    console.log('Presigned URL 응답:', response.data);
    const uploadUrl = response.data.data.uploadUrl;
    console.log('업로드 URL:', uploadUrl);

    // 2. 파일 업로드
    console.log('2단계: 파일 업로드 시작...');
    console.log('업로드 URL:', uploadUrl);
    console.log('파일 타입:', file.type);
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    console.log('업로드 응답 상태:', uploadResponse.status);
    console.log('업로드 응답 텍스트:', uploadResponse.statusText);

    if (!uploadResponse.ok) {
      throw new Error(`업로드 실패: ${uploadResponse.status} - ${uploadResponse.statusText}`);
    }

    // 3. 업로드된 이미지 URL 반환 (presigned URL에서 실제 URL 추출)
    const uploadedUrl = uploadUrl.split('?')[0];
    console.log('3단계: 업로드 완료');
    console.log('최종 URL:', uploadedUrl);
    return uploadedUrl;

  } catch (error) {
    console.error('회사 이미지 업로드 실패:', error);
    throw new Error('이미지 업로드에 실패했습니다.');
  }
} 