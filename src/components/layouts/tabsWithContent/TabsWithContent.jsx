import { Paper, Tabs, Tab, Box, Typography, Stack } from "@mui/material";

export default function TabsWithContent({
  tabs = [], // [{ label: "탭이름", icon: <Icon /> }]
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
        backgroundColor: "background.paper",
        flexGrow: 1,
        mx: 3,
        mb: 3,
        px: 3,
        pb: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        ...containerSx,
      }}
    >
      <Tabs
        value={value}
        onChange={onChange}
        sx={{
          minHeight: 30,
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
          />
        ))}
      </Tabs>

      <Box flexGrow={1} pt={3} sx={{ ...contentSx }}>
        {content || (
          <Typography color="text.secondary">내용이 없습니다</Typography>
        )}
      </Box>
    </Paper>
  );
}
