// src/features/project/approval/pages/ProjectApprovalsPage.jsx

import React, { useState } from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  Chip,
} from "@mui/material";

// 단계 데이터
const dummyProgress = [
  { title: "전체", progress: 100 },
  { title: "기획", progress: 100 },
  { title: "디자인", progress: 75 },
  { title: "퍼블리싱", progress: 50 },
  { title: "개발", progress: 30 },
  { title: "검수", progress: 0 },
];

// 체크리스트 항목 (단계 + 상태)
const dummyChecklists = [
  { task: "요구사항 정리", step: "기획", status: "대기" },
  { task: "화면 기획", step: "기획", status: "승인" },
  { task: "UX 검토", step: "기획", status: "반려" },
  { task: "와이어프레임 제작", step: "디자인", status: "대기" },
  { task: "UI 디자인", step: "디자인", status: "승인" },
  { task: "프로토타입 피드백", step: "디자인", status: "반려" },
  { task: "HTML/CSS 마크업", step: "퍼블리싱", status: "승인" },
  { task: "반응형 처리", step: "퍼블리싱", status: "대기" },
  { task: "API 연동", step: "개발", status: "대기" },
  { task: "상태 관리", step: "개발", status: "승인" },
  { task: "로직 구현", step: "개발", status: "반려" },
  { task: "단위 테스트", step: "검수", status: "대기" },
  { task: "QA 완료", step: "검수", status: "승인" },
];

export default function ProjectApprovalsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selected, setSelected] = useState("전체");

  const filteredTasks =
    selected === "전체"
      ? dummyChecklists
      : dummyChecklists.filter((task) => task.step === selected);

  const grouped = {
    대기: filteredTasks.filter((t) => t.status === "대기"),
    승인: filteredTasks.filter((t) => t.status === "승인"),
    반려: filteredTasks.filter((t) => t.status === "반려"),
  };

  const statusColors = {
    대기: "warning",
    승인: "success",
    반려: "error",
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 스텝 선택 카드 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: isMobile ? 2 : 3,
          justifyContent: "center",
        }}
      >
        {dummyProgress.map((item, idx) => (
          <React.Fragment key={item.title}>
            <Box
              onClick={() => setSelected(item.title)}
              sx={{
                cursor: "pointer",
                width: isMobile ? "100%" : 100,
                textAlign: "center",
                p: 2,
                borderRadius: 2,
                transition: "all 0.2s",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 1,
                  fontWeight: selected === item.title ? 700 : 500,
                  color:
                    selected === item.title
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                }}
              >
                {item.title}
              </Typography>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress
                  variant="determinate"
                  size={60}
                  thickness={4}
                  value={item.progress}
                  sx={{
                    color:
                      selected === item.title
                        ? theme.palette.primary.main
                        : theme.palette.grey[300],
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color:
                        selected === item.title
                          ? theme.palette.primary.main
                          : theme.palette.text.primary,
                    }}
                  >
                    {item.progress}%
                  </Typography>
                </Box>
              </Box>
            </Box>

            {!isMobile && idx < dummyProgress.length - 1 && (
              <Box
                sx={{
                  flex: "1 1 auto",
                  height: 2,
                  backgroundColor: theme.palette.divider,
                  mx: 1,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Box>

      {/* 상태별 카드 컬럼 */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          gap: 2,
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
        }}
      >
        {["대기", "승인", "반려"].map((status) => (
          <Paper
            key={status}
            elevation={2}
            sx={{
              flex: 1,
              p: 2,
              borderRadius: 2,
              minHeight: 300,
              bgcolor: theme.palette.background.paper,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 2, textAlign: "center" }}
            >
              {status}
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              {grouped[status].length === 0 ? (
                <Typography color="text.secondary" fontSize={14}>
                  항목 없음
                </Typography>
              ) : (
                grouped[status].map((item, idx) => (
                  <Card key={idx} variant="outlined">
                    <CardContent>
                      <Typography fontSize={14} fontWeight={600} gutterBottom>
                        {item.task}
                      </Typography>
                      <Chip
                        label={item.status}
                        size="small"
                        color={statusColors[item.status]}
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                ))
              )}
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
