import * as postAPI from "@/api/post";

export async function uploadFileWithPresignedUrl({
  fileItem,
  postId,
  updateFile,
}) {
  try {
    updateFile(fileItem.id, { status: "uploading", progress: 0, error: null });

    const uploadUrlResponse = await postAPI.issueAttachmentUploadUrl({
      postId,
      fileName: fileItem.file.name,
    });

    const { postAttachmentId, uploadUrl } = uploadUrlResponse.data.data;
    updateFile(fileItem.id, { progress: 10, postAttachmentId });

    const uploadResponse = await postAPI.uploadFileToS3(
      uploadUrl,
      fileItem.file
    );
    if (!uploadResponse.ok) {
      throw new Error(`파일 업로드 실패: ${uploadResponse.status}`);
    }

    updateFile(fileItem.id, { progress: 80 });
    updateFile(fileItem.id, {
      status: "success",
      progress: 100,
      postAttachmentId,
    });
  } catch (error) {
    console.error("파일 업로드 실패:", error);
    updateFile(fileItem.id, {
      status: "error",
      progress: 0,
      error:
        error.response?.data?.error?.message ||
        error.message ||
        "파일 업로드에 실패했습니다.",
    });
  }
}
