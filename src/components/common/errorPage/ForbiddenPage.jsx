import React from "react";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";
import { Box, Typography } from "@mui/material";

export default function ForbiddenPage() {
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
          403 Forbidden
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          접근 권한이 없습니다.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          이 페이지에 접근할 권한이 없습니다. 관리자에게 문의하세요.
        </Typography>
      </Box>
    </PageWrapper>
  );
} 