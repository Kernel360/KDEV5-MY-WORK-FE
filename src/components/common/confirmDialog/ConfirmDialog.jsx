// src/components/common/ConfirmDialog/ConfirmDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import CustomButton from "@/components/common/customButton/CustomButton";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * 범용 ConfirmDialog 컴포넌트
 * @param {boolean} open - 다이얼로그 열림 여부
 * @param {() => void} onClose - 닫기 요청 콜백
 * @param {() => void} onConfirm - 확인 요청 콜백
 * @param {string} title - 다이얼로그 제목
 * @param {string} description - 상세 메시지
 * @param {string} confirmText - 확인 버튼 텍스트 (삭제 다이얼로그일 경우 무시됨)
 * @param {"primary"|"ghost"|"danger"|"ghost-danger"|"ghost-info"|"ghost-success"|"text"} confirmKind - 확인 버튼 종류 (삭제 다이얼로그일 경우 무시됨)
 * @param {boolean} isDelete - 삭제 다이얼로그 여부 (true일 경우 텍스트/아이콘 고정)
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "확인",
  confirmKind = "primary",
  isDelete = false,
}) {
  const finalConfirmText = isDelete ? "삭제" : confirmText;
  const finalConfirmKind = isDelete ? "danger" : confirmKind;
  const finalConfirmIcon = isDelete ? <DeleteIcon /> : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {title && <DialogTitle>{title}</DialogTitle>}

      {description && (
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      )}

      <DialogActions>
        <CustomButton kind="ghost" onClick={onClose} startIcon={<CloseIcon />}>
          취소
        </CustomButton>
        <CustomButton
          kind={finalConfirmKind}
          onClick={onConfirm}
          startIcon={finalConfirmIcon}
        >
          {finalConfirmText}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
