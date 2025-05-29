// src/components/common/ConfirmDialog/ConfirmDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

/**
 * 범용 ConfirmDialog 컴포넌트
 * @param {boolean} open - 다이얼로그 열림 여부
 * @param {() => void} onClose - 닫기 요청 콜백
 * @param {() => void} onConfirm - 확인 요청 콜백
 * @param {string} title - 다이얼로그 제목
 * @param {string} description - 상세 메시지
 * @param {string} cancelText - 취소 버튼 텍스트
 * @param {string} confirmText - 확인 버튼 텍스트
 * @param {"inherit"|"primary"|"secondary"|"error"|"info"|"success"|"warning"} confirmColor - 확인 버튼 색상
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  cancelText = "취소",
  confirmText = "확인",
  confirmColor = "primary",
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {title && <DialogTitle>{title}</DialogTitle>}
      {description && (
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color={confirmColor} variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
