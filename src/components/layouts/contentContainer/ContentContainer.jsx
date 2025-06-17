// src/components/layouts/ContentContainer.jsx
import React from "react";
import { Paper } from "@mui/material";

export default function ContentContainer({ children, sx }) {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        px: 3,
        mb: 3,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}
