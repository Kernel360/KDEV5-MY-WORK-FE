import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

export default function ApprovalDetailContent({ checkList }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: theme.palette.grey[50],
        borderRadius: 2,
      }}
    >
      <Typography
        variant="body1"
        sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
      >
        {checkList.content}
      </Typography>
    </Box>
  );
}
