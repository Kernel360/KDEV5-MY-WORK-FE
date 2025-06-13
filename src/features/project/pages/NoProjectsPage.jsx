import { Box, Typography } from "@mui/material";
import PageWrapper from "@/components/layouts/pageWrapper/PageWrapper";

export default function NoProjectsPage() {
  return (
    <PageWrapper>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          borderRadius: 2,
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          프로젝트 목록에 접근할 수 없습니다.
        </Typography>
      </Box>
    </PageWrapper>
  );
}
