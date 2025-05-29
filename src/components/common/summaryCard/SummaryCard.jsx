// src/components/common/summaryCard/SummaryCard.jsx
import React from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  cardContainerSx,
  statusChipSx,
  customChipSx,
  progressSx,
  infoRowSx,
  infoLabelSx,
  infoValueSx,
} from "./SummaryCard.styles";

/**
 * SummaryCard 컴포넌트
 * @param {Array} schema - [{ key, label, type: 'text'|'status'|'avatar'|'progress'|'link'|'boolean', color }] 형태의 필드 정의
 * @param {object} data - schema에 맞는 키를 가진 데이터 객체
 * @param {boolean} noMarginBottom - 하단 여백 제거 여부
 */
export default function SummaryCard({
  schema = [],
  data = {},
  noMarginBottom = false,
}) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={[cardContainerSx, noMarginBottom && { marginBottom: 1 }]}
    >
      <Stack
        direction="row"
        spacing={3}
        alignItems="center"
        flexWrap="wrap"
        rowGap={1.5}
      >
        {schema.map(({ key, label, type, color }) => {
          const value = data[key];
          if (value === undefined || value === null) return null;

          let renderedValue = null;

          switch (type) {
            case "status": {
              const statusColor =
                theme.palette.status?.[color] || theme.palette.grey;
              renderedValue = (
                <Chip
                  label={value}
                  size="small"
                  sx={statusChipSx(statusColor)}
                />
              );
              break;
            }

            case "avatar":
              renderedValue = (
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar src={value.avatar} sx={{ width: 20, height: 20 }} />
                  <Typography variant="body2">{value.name}</Typography>
                </Stack>
              );
              break;

            case "progress":
              renderedValue = (
                <Stack spacing={0.5} minWidth={100}>
                  <LinearProgress
                    variant="determinate"
                    value={value}
                    sx={progressSx(theme, value)}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {value}%
                  </Typography>
                </Stack>
              );
              break;

            case "link":
              renderedValue = (
                <Link
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                >
                  {value}
                </Link>
              );
              break;

            case "boolean":
              renderedValue = (
                <Typography variant="body2">
                  {value ? "예" : "아니오"}
                </Typography>
              );
              break;

            default:
              renderedValue = <Typography variant="body2">{value}</Typography>;
          }

          return (
            <Stack
              key={key}
              direction="row"
              spacing={1}
              alignItems="center"
              sx={infoRowSx}
            >
              <Typography variant="body2" sx={infoLabelSx}>
                {label}:
              </Typography>
              <Box sx={infoValueSx}>{renderedValue}</Box>
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
}
