import React from "react";
import { Box } from "@mui/material";

export default function PageWrapper({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "96vh",
        backgroundColor: (theme) => theme.palette.background.default,
        overflow: "hidden",
        borderRadius: 2,
      }}
    >
      {children}
    </Box>
  );
}
