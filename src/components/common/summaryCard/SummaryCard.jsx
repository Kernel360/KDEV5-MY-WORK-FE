import React from "react";
import { Box, Paper, Typography, Chip, Avatar, LinearProgress, Link } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  cardContainerSx,
  statusChipSx,
  progressSx,
} from "./SummaryCard.styles";

export default function SummaryCard({ schema = [], data = {}, noMarginBottom = false }) {
  const theme = useTheme();

  // schema 기반으로 렌더링할 항목 준비
  const renderedItems = schema
    .map(({ key, label, type, color }) => {
      const value = data[key];
      if (value === undefined || value === null) return null;

      // 각 타입별 컴포넌트 생성
      let itemComponent;
      switch (type) {
        case "status": {
          const statusColor = theme.palette.status?.[color] || theme.palette.grey;
          itemComponent = <Chip label={value} size="small" sx={statusChipSx(statusColor)} />;
          break;
        }
        case "avatar":
          itemComponent = (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar src={value.avatar} sx={{ width: 20, height: 20, mr: 0.5 }} />
              <Typography variant="body2">{value.name}</Typography>
            </Box>
          );
          break;
        case "progress":
          itemComponent = (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LinearProgress variant="determinate" value={value} sx={progressSx(theme, value)} />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                {value}%
              </Typography>
            </Box>
          );
          break;
        case "link":
          itemComponent = (
            <Link href={value} target="_blank" rel="noopener noreferrer">
              {value}
            </Link>
          );
          break;
        case "boolean":
          itemComponent = <Typography variant="body2">{value ? "예" : "아니오"}</Typography>;
          break;
        default:
          itemComponent = <Typography variant="body2">{value}</Typography>;
      }

      // label과 값 함께 렌더링
      return (
        <Box key={key} sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body2" sx={{ fontWeight: 500, mr: 0.5, color: theme.palette.text.secondary }}>
            {label} :
          </Typography>
          {itemComponent}
        </Box>
      );
    })
    .filter(Boolean);

  // 아이템 사이에 구분자 삽입
  const contents = [];
  renderedItems.forEach((item, idx) => {
    if (idx > 0) {
      contents.push(
        <Typography
          key={`sep-${idx}`}
          variant="body2"
          sx={{ mx: 0.5, color: theme.palette.text.secondary }}
        >
          |
        </Typography>
      );
    }
    contents.push(item);
  });

  return (
    <Paper elevation={0} sx={[cardContainerSx, noMarginBottom && { marginBottom: 1 }]}>  
      <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", rowGap: 1 }}>
        {contents}
      </Box>
    </Paper>
  );
}