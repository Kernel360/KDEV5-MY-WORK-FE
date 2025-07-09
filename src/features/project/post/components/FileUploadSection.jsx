import React from "react";
import { Box, Stack, Typography, Divider, Tooltip } from "@mui/material";
import { InfoOutlined, CloudUpload } from "@mui/icons-material";
import CustomButton from "@/components/common/customButton/CustomButton";
import FileAttachmentCard from "./FileAttachmentCard";

export default function FileUploadSection({
  files,
  onSelect,
  onDelete,
  onRetry,
  onPreview,
}) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle1" fontWeight={600}>
          4. 파일 첨부
        </Typography>
        <Tooltip title="모든 파일 형식 첨부 가능합니다. (최대 5MB, 실행파일 제외)">
          <InfoOutlined fontSize="small" color="action" />
        </Tooltip>
      </Stack>
      <Divider sx={{ mt: 1, mb: 2 }} />

      <Stack spacing={2}>
        <input
          type="file"
          multiple
          onChange={onSelect}
          style={{ display: "none" }}
          id="file-upload"
          accept="*"
        />
        <label htmlFor="file-upload">
          <CustomButton
            kind="ghost"
            component="span"
            startIcon={<CloudUpload />}
          >
            파일 선택
          </CustomButton>
        </label>
      </Stack>

      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            첨부 파일 목록 ({files.length}개)
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
  );
}
