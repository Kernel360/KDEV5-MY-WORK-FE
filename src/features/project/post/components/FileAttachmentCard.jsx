import React from "react";
import {
  Box,
  Typography,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
} from "@mui/material";
import { ZoomIn, Delete, Refresh } from "@mui/icons-material";
import { getFileIcon } from "@/utils/getFileIcon";
import { formatFileSize } from "@/utils/formatFileSize";

export default function FileAttachmentCard({
  file,
  onPreview,
  onDelete,
  onRetry,
}) {
  const isImage = file.type?.startsWith("image/");

  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: file.status === "error" ? "error.main" : "grey.300",
        borderRadius: 1,
        bgcolor: file.status === "success" ? "success.50" : "background.paper",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        {/* 썸네일 또는 아이콘 */}
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 1,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "grey.300",
            bgcolor: "grey.100",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isImage ? "pointer" : "default",
            "&:hover": isImage
              ? { borderColor: "primary.main", opacity: 0.8 }
              : {},
          }}
          onClick={() => isImage && onPreview?.(file)}
        >
          {isImage ? (
            <img
              src={URL.createObjectURL(file.file)}
              alt={file.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            getFileIcon(file.name, file.type)
          )}
        </Box>

        {/* 파일 이름 + 용량 */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" noWrap>
            {file.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatFileSize(file.size)}
          </Typography>
        </Box>

        {/* 상태 및 액션 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {file.status === "pending" && <Chip label="대기중" size="small" />}
          {file.status === "uploading" && (
            <Chip label="업로드중" size="small" color="warning" />
          )}
          {file.status === "success" && (
            <Chip label="완료" size="small" color="success" />
          )}
          {file.status === "error" && (
            <Chip label="오류" size="small" color="error" />
          )}

          {file.status === "error" && (
            <Tooltip title="다시 업로드">
              <IconButton
                size="small"
                onClick={() => onRetry?.(file.id)}
                color="warning"
              >
                <Refresh fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          {isImage && (
            <Tooltip title="미리보기">
              <IconButton
                size="small"
                onClick={() => onPreview?.(file)}
                color="primary"
              >
                <ZoomIn fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <IconButton
            size="small"
            onClick={() => onDelete?.(file.id)}
            color="error"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </Stack>

      {/* 진행률 */}
      {file.status === "uploading" && (
        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={file.progress}
            sx={{ height: 4, borderRadius: 2 }}
          />
          <Typography variant="caption" color="text.secondary">
            {file.progress}% 완료
          </Typography>
        </Box>
      )}

      {/* 에러 메시지 */}
      {file.error && (
        <Alert
          severity="error"
          variant="filled"
          sx={{
            mt: 1,
            borderRadius: 2,
            fontSize: "0.9rem",
            px: 2,
            py: 1,
            bgcolor: (theme) => theme.palette.status?.error?.bg || "",
            color: (theme) => theme.palette.status?.error?.main || "",
            boxShadow: 1,
          }}
        >
          {file.error}
        </Alert>
      )}
    </Box>
  );
}
