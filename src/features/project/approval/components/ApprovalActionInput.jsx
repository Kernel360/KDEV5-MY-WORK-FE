// ApprovalActionInput.jsx
import React from "react";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import CustomButton from "@/components/common/customButton/CustomButton";

export default function ApprovalActionInput({
  approvalType,
  setApprovalType,
  reasonText,
  setReasonText,
  onCancel,
  onConfirm,
}) {
  const theme = useTheme();

  return (
    <>
      <Stack direction="row" spacing={1} justifyContent="flex-end">
        <CustomButton
          kind="ghost-success"
          size="small"
          onClick={() => setApprovalType("APPROVED")}
        >
          승인
        </CustomButton>
        <CustomButton
          kind="ghost-danger"
          size="small"
          onClick={() => setApprovalType("REJECTED")}
        >
          반려
        </CustomButton>
        <CustomButton
          kind="ghost-info"
          size="small"
          onClick={() => setApprovalType("REQUEST_CHANGES")}
        >
          수정 요청
        </CustomButton>
      </Stack>

      {approvalType && (
        <Stack spacing={2} mt={2}>
          <Typography fontWeight={600}>사유 입력</Typography>
          <Box
            component="textarea"
            rows={4}
            value={reasonText}
            onChange={(e) => setReasonText(e.target.value)}
            placeholder="사유를 입력해주세요"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: `1px solid ${theme.palette.divider}`,
              fontSize: "14px",
              resize: "none",
              fontFamily: "inherit",
            }}
          />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <CustomButton kind="ghost" size="small" onClick={onCancel}>
              취소
            </CustomButton>
            <CustomButton
              kind="primary"
              size="small"
              onClick={onConfirm}
              disabled={!reasonText.trim()}
            >
              저장
            </CustomButton>
          </Stack>
        </Stack>
      )}
    </>
  );
}
