import React from "react";
import { Modal, Box, Typography, Stack, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function FilePreviewModal({ open, attachment, onClose }) {
  if (!attachment) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 1, sm: 2 },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: { xs: "95vw", sm: "90vw", md: "80vw" },
          maxHeight: { xs: "95vh", sm: "90vh" },
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "rgba(0, 0, 0, 0.03)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
            {attachment.fileName}
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              bgcolor: "rgba(0, 0, 0, 0.1)",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.2)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
            bgcolor: "grey.50",
            minHeight: 0,
            position: "relative",
          }}
        >
          <img
            src={attachment.imageUrl}
            alt={attachment.fileName}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Box>

        <Box
          sx={{
            p: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                <strong>크기:</strong> {formatFileSize(attachment.fileSize)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>타입:</strong> {attachment.fileType}
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }} />
            <Typography variant="caption" color="text.secondary">
              클릭하여 닫기 또는 ESC 키 사용
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}
