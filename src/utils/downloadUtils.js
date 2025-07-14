export async function downloadAttachment(attachment, getPresignedUrlFn) {
  try {
    // 1. GET /api/posts/attachment/download-url - 다운로드 URL 발급
    const response = await getPresignedUrlFn(attachment.id);

    if (response.data.result === "SUCCESS") {
      const downloadUrl = response.data.data.downloadUrl;

      // 2. GET {downloadUrl} - 실제 파일 다운로드
      const fileResponse = await fetch(downloadUrl);
      if (!fileResponse.ok) throw new Error("파일 다운로드 실패");

      const blob = await fileResponse.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = attachment.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } else {
      throw new Error("다운로드 URL 발급 실패");
    }
  } catch (error) {
    console.error(error);
    alert("파일 다운로드에 실패했습니다.");
  }
}
