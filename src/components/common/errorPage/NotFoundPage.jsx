import React from "react";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import { Box, Typography } from "@mui/material";

export default function NotFoundPage() {
  return (
    <PageWrapper>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          minHeight: 320,
          p: 3,
        }}
      >
        <Typography variant="h3" color="error" gutterBottom>
          404 Not Found
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          페이지를 찾을 수 없습니다.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          존재하지 않거나 삭제된 리소스입니다.
        </Typography>
      </Box>
    </PageWrapper>
  );
} 