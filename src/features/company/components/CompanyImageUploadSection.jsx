import React from "react";
import {
  Box,
  Stack,
  Typography,
  Divider,
  Tooltip,
  Alert,
  IconButton,
  CircularProgress,
  Chip,
} from "@mui/material";
import { InfoOutlined, CloudUpload, Delete } from "@mui/icons-material";
import CustomButton from "@/components/common/customButton/CustomButton";

export default function CompanyImageUploadSection({
  previewUrl,
  error,
  onSelect,
  onDelete,
  existingImagePath,
  isEdit = false,
  uploadStatus = "idle",
}) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant="subtitle1" fontWeight={600}>
          4. 회사 로고
        </Typography>
        <Tooltip title="회사 로고 이미지를 업로드하세요. (JPG, PNG, GIF, 최대 5MB)">
          <InfoOutlined fontSize="small" color="action" />
        </Tooltip>
      </Stack>
      <Divider sx={{ mt: 1, mb: 2 }} />

      <Stack spacing={2}>
        {/* 이미지 미리보기 영역 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* 이미지 미리보기 또는 플레이스홀더 */}
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              border: "3px solid",
              borderColor: (previewUrl || (isEdit && existingImagePath && !previewUrl)) 
                ? "primary.main" 
                : "grey.300",
              overflow: "hidden",
              boxShadow: (previewUrl || (isEdit && existingImagePath && !previewUrl))
                ? "0 4px 12px rgba(0, 0, 0, 0.15)"
                : "0 2px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "grey.50",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* 업로드 상태 표시 */}
            {uploadStatus === "uploading" && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  zIndex: 1,
                }}
              >
                <CircularProgress size={24} />
              </Box>
            )}
            {(previewUrl || (isEdit && existingImagePath && !previewUrl)) ? (
              <img
                src={previewUrl || existingImagePath}
                alt="회사 로고 미리보기"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                  textAlign: "center",
                  p: 2,
                }}
              >
                <CloudUpload sx={{ fontSize: 32, mb: 1, opacity: 0.5 }} />
                <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                  회사 로고
                </Typography>
              </Box>
            )}
          </Box>

          {/* 파일 선택 버튼 */}
          <Box>
            <input
              type="file"
              accept="image/*"
              onChange={onSelect}
              style={{ display: "none" }}
              id="company-image-upload"
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", gap: 1, flexDirection: "row" }}>
                <label htmlFor="company-image-upload">
                  <CustomButton
                    kind="ghost"
                    component="span"
                    startIcon={<CloudUpload />}
                    disabled={uploadStatus === "uploading"}
                  >
                    {uploadStatus === "uploading" 
                      ? "업로드 중..." 
                      : previewUrl || (isEdit && existingImagePath && !previewUrl)
                      ? "이미지 변경" 
                      : "이미지 선택"}
                  </CustomButton>
                </label>
                
                {/* 삭제 버튼 - 이미지가 있을 때만 표시 */}
                {(previewUrl || (isEdit && existingImagePath && !previewUrl)) && (
                  <CustomButton
                    kind="ghost"
                    onClick={onDelete}
                    startIcon={<Delete />}
                    sx={{
                      color: "#f44336",
                      borderColor: "#f44336",
                      "&:hover": {
                        backgroundColor: "#f443361a",
                        borderColor: "#d32f2f",
                        color: "#d32f2f",
                      },
                    }}
                  >
                    삭제
                  </CustomButton>
                )}
              </Box>
              
              {/* 업로드 상태 칩 */}
              {uploadStatus === "uploading" && (
                <Chip 
                  label="업로드 중" 
                  size="small" 
                  color="warning"
                  sx={{ alignSelf: "flex-start" }}
                />
              )}
              {uploadStatus === "success" && (
                <Chip 
                  label="업로드 완료" 
                  size="small" 
                  color="success"
                  sx={{ alignSelf: "flex-start" }}
                />
              )}
              {uploadStatus === "error" && (
                <Chip 
                  label="업로드 실패" 
                  size="small" 
                  color="error"
                  sx={{ alignSelf: "flex-start" }}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* 에러 메시지 */}
        {error && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}
      </Stack>
      
      {/* 하단 여백 */}
      <Box sx={{ mb: 2 }} />
    </Box>
  );
} 