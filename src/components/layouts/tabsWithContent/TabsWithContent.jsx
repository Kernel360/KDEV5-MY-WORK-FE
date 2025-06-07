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
        px:3,
        ...containerSx,
      }}
    >
      {/* ─── 1. 탭바 (고정 높이) ───────────────── */}
      <Tabs
        value={value}
        onChange={onChange}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          "& .MuiTabs-indicator": {
            backgroundColor: "primary.main",
            height: 3,
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
              mb:3,
              px: 2,
              color: "text.primary",
              "&.Mui-selected": {
                color: "primary.main",
                fontWeight: "600",
              },
              ...(tab.sx ?? {}),
            }}
          />
        ))}
      </Tabs>

      {/* ─── 2. 콘텐츠 영역 (스크롤 가능) ───────────────── */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,          // 매우 중요: 이걸 주어야 flexGrow 영역이 스크롤을 갖는다
          width: "100%",         // 가로 너비를 항상 100%로 채워서 탭마다 크기 변동을 없앤다
          overflowY: "auto",     // 내용이 넘칠 때 내부에서만 스크롤
          ...contentSx,
        }}
      >
        {/* 
          콘텐츠 컴포넌트를 감싸서, 
          내부에서 스크롤이 잘 동작하려면 이 Box를 통해 크기를 100%로 고정해야 한다 
        */}
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
