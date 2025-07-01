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
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import {
  PictureAsPdf,
  Description,
  TableChart,
  Archive,
  Code,
  Movie,
  MusicNote,
} from "@mui/icons-material";
import AlertMessage from "@/components/common/alertMessage/AlertMessage";
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getFileIcon(fileName, fileType) {
  const ext = fileName.toLowerCase().split(".").pop();
  if (fileType.startsWith("image/")) return <ImageIcon color="primary" />;
  if (["pdf"].includes(ext)) return <PictureAsPdf color="error" />;
  if (["doc", "docx", "txt", "rtf"].includes(ext)) return <Description />;
  if (["xls", "xlsx", "csv"].includes(ext))
    return <TableChart color="success" />;
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return <Archive color="warning" />;
  if (["js", "ts", "jsx", "tsx", "html", "css", "json", "xml"].includes(ext))
    return <Code color="info" />;
  if (["mp4", "avi", "mov", "wmv", "flv", "mkv"].includes(ext))
    return <Movie color="secondary" />;
  if (["mp3", "wav", "flac", "aac", "ogg"].includes(ext))
    return <MusicNote color="secondary" />;
  return <InsertDriveFileIcon color="action" />;
}

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
        {attachments.map((file) => (
          <Box
            key={file.id}
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
                {getFileIcon(file.fileName, file.fileType)}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {file.fileName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatFileSize(file.fileSize)}
                  {file.fileType && ` • ${file.fileType}`}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                {file.isImage && file.imageUrl && onPreview && (
                  <Tooltip title="미리보기">
                    <IconButton size="small" onClick={() => onPreview(file)}>
                      <ZoomInIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {onDownload && (
                  <Tooltip title="다운로드">
                    <IconButton size="small" onClick={() => onDownload(file)}>
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
        ))}
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
