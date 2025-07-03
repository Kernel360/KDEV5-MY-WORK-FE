// @/utils/fileUploadUtils.js

/**
 * 파일 상태를 업데이트하여 새 배열 반환
 */
export const updateFileItem = (files, id, updated) =>
  files.map((file) => (file.id === id ? { ...file, ...updated } : file));

/**
 * 업로드가 아직 완료되지 않은 파일이 있는지 확인
 */
export const hasUnfinishedUploads = (files) =>
  files.some(
    (file) => file.status === "uploading" || file.status === "pending"
  );

/**
 * 업로드에 실패한 파일이 있는지 확인
 */
export const hasFailedUploads = (files) =>
  files.some((file) => file.status === "error");

/**
 * 업로드 성공한 파일들의 postAttachmentId 목록 반환
 */
export const getSuccessfulPostAttachmentIds = (files) =>
  files
    .filter((file) => file.status === "success" && file.postAttachmentId)
    .map((file) => file.postAttachmentId);

/**
 * 중복 파일 제거 후 새 파일 목록 반환
 */
export const getUniqueFiles = (newFiles, existingFiles) => {
  return newFiles.filter(
    (file) => !existingFiles.some((f) => f.name === file.name)
  );
};

/**
 * File 객체를 FileItem 형태로 변환 (업로드용 준비)
 */
export const convertToFileItems = (files) => {
  return files.map((file) => ({
    id: Date.now() + Math.random(),
    file,
    name: file.name,
    size: file.size,
    type: file.type,
    status: "pending",
    progress: 0,
    error: null,
    postAttachmentId: null,
  }));
};
