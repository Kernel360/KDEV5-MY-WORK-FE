import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingScreen({ message = "로딩 중입니다..." }) {
  return (
    <Box
      sx={{
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
      <Typography variant="body2" sx={{ mt: 2, color: "primary.contrastText" }}>
        {message}
      </Typography>
    </Box>
  );
}
