// src/features/project/approval/components/ProjectApprovalsDrawer.jsx
import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ProjectApprovalDetailDrawer({ open, item, onClose }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : 400,
          p: 3,
          borderTopLeftRadius: 12,
          borderBottomLeftRadius: 12,
        },
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={700}>
          {item?.checkListName}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
        {item?.projectStepName} · {item?.createdAt}
      </Typography>
      <Typography
        fontSize={14}
        sx={{
          whiteSpace: "pre-wrap",
          lineHeight: 1.7,
          color: theme.palette.text.primary,
        }}
      >
        {item?.checkListContent}
      </Typography>
    </Drawer>
  );
}
