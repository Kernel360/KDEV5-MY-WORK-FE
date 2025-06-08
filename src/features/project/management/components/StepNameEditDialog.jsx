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

/**
 * @param {{
 *   open: boolean,
 *   value: string,
 *   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 *   onClose: () => void,
 *   onConfirm: () => void
 * }} props
 */
export default function StepNameEditDialog({ open, value, onChange, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>단계 이름 변경</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="단계 이름"
            fullWidth
            value={value}
            onChange={onChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <CustomButton kind="ghost" onClick={onClose} size="small">
          취소
        </CustomButton>
        <CustomButton
          kind="primary"
          onClick={onConfirm}
          size="small"
          disabled={!value.trim()}
        >
          변경
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}

