import React from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import DownloadIcon from "@mui/icons-material/Download";
import AlertMessage from "@/components/common/alertMessage/AlertMessage";
import { getFileIcon } from "@/utils/getFileIcon";

export default function FileAttachmentViewer({
  attachments = [],
  loading = false,
  error = null,
  onPreview,
  onDownload,
}) {
  const [alert, setAlert] = React.useState({
    open: false,
    message: "",
    severity: "error",
  });

  React.useEffect(() => {
    if (error) {
      setAlert({
        open: true,
        message: `파일 로드 실패: ${error}`,
        severity: "error",
      });
    }
  }, [error]);

  if (!attachments.length && !loading) return null;

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} mb={2}>
        <Typography variant="h6" fontWeight={600}>
          첨부파일 ({attachments.length}개)
          {loading && " (로딩 중...)"}
        </Typography>
      </Stack>
      <Divider sx={{ mb: 3 }} />

      <Stack spacing={1}>
        {attachments.map((file) => {
          // postAttachments 구조에 맞게 매핑
          const fileData = {
            id: file.postAttachmentId,
            fileName: file.fileName,
            fileSize: file.fileSize,
            fileType: file.fileType,
            isImage: file.fileType?.startsWith("image/"),
          };

          return (
            <Box
              key={file.postAttachmentId}
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "grey.300",
                borderRadius: 1,
                bgcolor: "background.paper",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "grey.50",
                },
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "grey.100",
                    borderRadius: 1,
                  }}
                >
                  {getFileIcon(fileData.fileName, fileData.fileType)}
                </Box>
                                 <Box sx={{ flex: 1, minWidth: 0 }}>
                   <Typography variant="body2" fontWeight={600} noWrap>
                     {fileData.fileName}
                   </Typography>
                   {fileData.fileType && (
                     <Typography variant="caption" color="text.secondary">
                       {fileData.fileType}
                     </Typography>
                   )}
                 </Box>
                <Stack direction="row" spacing={1}>
                  {onDownload && (
                    <Tooltip title="다운로드">
                      <IconButton size="small" onClick={() => onDownload(fileData)}>
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </Stack>

              {file.error && (
                <Box mt={1}>
                  <AlertMessage
                    open={true}
                    message={`파일 로드 실패: ${file.error}`}
                    severity="error"
                    onClose={() => {}}
                  />
                </Box>
              )}
            </Box>
          );
        })}
      </Stack>

      <AlertMessage
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
}
