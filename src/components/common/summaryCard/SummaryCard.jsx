// src/components/common/summaryCard/SummaryCard.jsx
import React from "react";
import { Box, Typography, Avatar, Link } from "@mui/material";
import {
  CardContainer,
  InfoRow,
  StatusChip,
  ProgressBar,
} from "./SummaryCard.Styles";

export default function SummaryCard({
  schema = [],
  data = {},
  noMarginBottom = false,
}) {
  // schema 기반으로 렌더링할 항목 준비
  const contents = schema.reduce((arr, { key, label, type, colorMap, labelMap }) => {
    const value = data[key];
    if (value == null || (Array.isArray(value) && value.length === 0)) return arr;

    let node;
    switch (type) {
      case "status": {
        const chipColor = colorMap?.[value];
        const chipLabel = labelMap?.[value] ?? value;
        node = (
          <StatusChip
            label={chipLabel}
            size="small"
            colorKey={chipColor}
          />
        );
        break;
      }
      case "avatar":
        node = (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar src={value.avatar} sx={{ width: 20, height: 20, mr: 0.5 }} />
            <Typography variant="body2">{value.name}</Typography>
          </Box>
        );
        break;
      case "progress":
        node = (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ProgressBar variant="determinate" barValue={value} value={value} />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              {value}%
            </Typography>
          </Box>
        );
        break;
      case "link":
        node = (
          <Link href={value} target="_blank" rel="noopener">
            {value}
          </Link>
        );
        break;
      case "boolean":
        node = <Typography variant="body2">{value ? "예" : "아니오"}</Typography>;
        break;
      default:
        node = <Typography variant="body2">{value}</Typography>;
    }

    arr.push(
      <InfoRow key={key} sx={{ display: 'inline-flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ fontWeight: 500, mr: 0.5, color: "text.secondary" }}>
          {label}:
        </Typography>
        {node}
      </InfoRow>
    );
    return arr;
  }, []);

  return (
    <CardContainer elevation={0} sx={noMarginBottom ? { mb: 1 } : {}}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          columnGap: 1,
          rowGap: 1,
        }}
      >
        {contents.map((row, idx) => (
          <React.Fragment key={idx}>
            {row}
            {idx < contents.length - 1 && (
              <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>
                |
              </Typography>
            )}
          </React.Fragment>
        ))}
      </Box>
    </CardContainer>
  );
}
