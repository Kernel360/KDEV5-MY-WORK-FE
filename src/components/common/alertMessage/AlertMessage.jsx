import React from "react";
import { Snackbar, Alert } from "@mui/material";

export default function AlertMessage({
  open,
  onClose,
  message,
  severity = "info",
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ zIndex: 3000 }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          borderRadius: 2,
          fontSize: "0.9rem",
          px: 2,
          py: 1,
          bgcolor: (theme) => theme.palette.status?.[severity]?.bg || "",
          color: (theme) => theme.palette.status?.[severity]?.main || "",
          boxShadow: 1,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
