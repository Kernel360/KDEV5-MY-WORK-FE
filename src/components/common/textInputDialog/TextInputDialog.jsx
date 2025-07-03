// src/components/common/TextInputDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box
} from "@mui/material";
import CustomButton from "@/components/common/customButton/CustomButton";

export default function TextInputDialog({
  open,
  title,
  label,
  cancelText,
  confirmText,
  confirmKind = "primary",
  value,
  onChange,
  onClose,
  onConfirm
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label={label}
            fullWidth
            value={value}
            onChange={onChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <CustomButton kind="ghost" onClick={onClose} size="small">
          {cancelText}
        </CustomButton>
        <CustomButton
          kind={confirmKind}
          onClick={onConfirm}
          size="small"
          disabled={!value.trim()}
        >
          {confirmText}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}
