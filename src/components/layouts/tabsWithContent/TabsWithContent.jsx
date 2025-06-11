// src/components/layouts/tabsWithContent/TabsWithContent.jsx
import { Paper, Tabs, Tab, Box, Typography } from "@mui/material";

export default function TabsWithContent({
  tabs = [],
  value,
  onChange,
  tabSx = {},
  content,
  contentSx = {},
  containerSx = {},
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",       // 부모로부터 내려온 높이를 100%로 채움
        minHeight: 0,         // 자식이 넘칠 때 스크롤을 위해 반드시 필요
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        px: 3,
        mb: 3,
        ...containerSx,
      }}
    >
      {/* ─── 1. 탭바 (고정 높이) ───────────────── */}
      <Tabs
        value={value}
        onChange={onChange}
        TabIndicatorProps={{ style: { height: 2 } }}
        sx={{
          minHeight: 58,  // 탭바 전체 최소 높이 조정
          borderBottom: "1px solid",
          borderColor: "divider",
          "& .MuiTabs-indicator": {
            backgroundColor: "primary.main",
            height: 2,  // 인디케이터 높이 조정
          },
          // 개별 탭 높이 및 패딩 축소
          "& .MuiTab-root": {
            minHeight: 58,
            paddingTop: 0,
            paddingBottom: 0,
          },
          ...tabSx,
        }}
      >
        {tabs.map((tab, idx) => (
          <Tab
            key={idx}
            icon={tab.icon}
            iconPosition="start"
            label={tab.label}
            sx={{
              textTransform: "none",
              fontWeight: "500",
              px: 2,
              color: "text.primary",
              lineHeight: 1.2,  // 텍스트 줄높이 조정
              fontSize: '0.875rem', // 폰트 크기 약간 축소
              "&.Mui-selected": {
                color: "primary.main",
                fontWeight: "600",
              },
              ...(tab.sx ?? {}),
            }}
          />
        ))}
      </Tabs>

      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,          // 매우 중요: 이걸 주어야 flexGrow 영역이 스크롤을 갖는다
          width: "100%",         // 가로 너비를 항상 100%로 채워서 탭마다 크기 변동을 없앤다
          overflowY: "auto",     // 내용이 넘칠 때 내부에서만 스크롤
          ...contentSx,
        }}
      >
        <Box
          sx={{
            width: "100%",   // 자식 콘텐츠가 부모 가로 폭을 완전히 채움
            minHeight: 0,    // 이걸 달아야 세로 스크롤이 올바르게 동작함
          }}
        >
          {content || (
            <Typography color="text.secondary">내용이 없습니다</Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
}