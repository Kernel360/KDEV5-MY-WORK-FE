import React from "react";
import { Box, Stack, Typography, Divider, Tooltip, Button } from "@mui/material";
import { InfoOutlined, CloudUpload } from "@mui/icons-material";
import CustomButton from "@/components/common/customButton/CustomButton";
import FileAttachmentCard from "./FileAttachmentCard";
import { getFileIcon } from "@/utils/getFileIcon";

export default function FileUploadSection({
  files,
  existingAttachments = [],
  onSelect,
  onDelete,
  onRetry,
  onPreview,
  onExistingDelete,
  title = "4. 파일 첨부",
  isEditing = false,
}) {
  const maxFiles = 3;
  const existingFileCount = isEditing ? existingAttachments.length : 0;
  const currentTotalFiles = existingFileCount + files.length;
  const remainingSlots = maxFiles - currentTotalFiles;
  const isMaxReached = remainingSlots <= 0;
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle1" fontWeight={600}>
          {title} ({currentTotalFiles}/{maxFiles})
        </Typography>
        <Tooltip title={isEditing ? "기존 파일을 삭제하거나 새로운 파일을 추가할 수 있습니다. (최대 3개)" : "모든 파일 형식 첨부 가능합니다. (최대 5MB, 실행파일 제외, 최대 3개)"}>
          <InfoOutlined fontSize="small" color="action" />
        </Tooltip>
      </Stack>
      <Divider sx={{ mt: 1, mb: 2 }} />

      {/* 기존 첨부파일 목록 (편집 모드에서만) */}
      {isEditing && existingAttachments.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            기존 첨부파일 ({existingAttachments.length}개)
          </Typography>
          <Stack spacing={1}>
            {existingAttachments.map((attachment) => (
              <Box
                key={attachment.postAttachmentId}
                sx={{
                  p: 2,
                  border: "1px solid",
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  bgcolor: 'background.paper',
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
                    {getFileIcon(attachment.fileName, attachment.fileType)}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="body2" 
                      fontWeight={600}
                      noWrap
                    >
                      {attachment.fileName}
                    </Typography>
                    {attachment.fileType && (
                      <Typography variant="caption" color="text.secondary">
                        {attachment.fileType}
                      </Typography>
                    )}
                  </Box>
                  <Box>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => onExistingDelete?.(attachment.postAttachmentId)}
                    >
                      삭제
                    </Button>
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {/* 새로운 파일 추가 섹션 */}
      <Box>
        {isEditing && (
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            새 파일 추가
          </Typography>
        )}
        
        <Stack spacing={2}>
          <input
            type="file"
            multiple
            onChange={onSelect}
            style={{ display: "none" }}
            id="file-upload"
            accept="*"
            disabled={isMaxReached}
          />
          <Box>
            <label htmlFor="file-upload">
              <CustomButton
                kind="ghost"
                component="span"
                startIcon={<CloudUpload />}
                disabled={isMaxReached}
              >
                {isMaxReached ? "최대 개수 도달" : "파일 선택"}
              </CustomButton>
            </label>
            {isMaxReached && (
              <Typography variant="caption" color="error" sx={{ display: "block", mt: 1 }}>
                최대 {maxFiles}개의 파일만 첨부할 수 있습니다.
              </Typography>
            )}
            {!isMaxReached && remainingSlots < maxFiles && (
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                {remainingSlots}개 더 추가할 수 있습니다.
              </Typography>
            )}
          </Box>
        </Stack>

        {files.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {isEditing ? "선택된 새 파일" : "첨부 파일 목록"} ({files.length}개)
            </Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />
            <Stack spacing={1}>
              {files.map((file) => (
                <FileAttachmentCard
                  key={file.id}
                  file={file}
                  onPreview={onPreview}
                  onDelete={onDelete}
                  onRetry={onRetry}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
