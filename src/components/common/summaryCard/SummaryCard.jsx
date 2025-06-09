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
  const contents = [];

  schema.forEach(({ key, label, type, color }) => {
    const value = data[key];
    if (value == null) return;

    let node;
    switch (type) {
      case "status":
        node = (
          <StatusChip
            key={key}
            label={value}
            size="small"
            colorKey={color}
          />
        );
        break;

      case "avatar":
        node = (
          <Box key={key} sx={{ display: "flex", alignItems: "center" }}>
            <Avatar src={value.avatar} sx={{ width: 20, height: 20, mr: 0.5 }} />
            <Typography variant="body2">{value.name}</Typography>
          </Box>
        );
        break;

      case "progress":
        node = (
          <Box key={key} sx={{ display: "flex", alignItems: "center" }}>
            <ProgressBar
              variant="determinate"
              barValue={value}
              value={value}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ ml: 0.5 }}
            >
              {value}%
            </Typography>
          </Box>
        );
        break;

      case "link":
        node = (
          <Link key={key} href={value} target="_blank" rel="noopener">
            {value}
          </Link>
        );
        break;

      case "boolean":
        node = (
          <Typography key={key} variant="body2">
            {value ? "예" : "아니오"}
          </Typography>
        );
        break;

      default:
        node = (
          <Typography key={key} variant="body2">
            {value}
          </Typography>
        );
    }

    contents.push(
      <InfoRow key={`row-${key}`}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, mr: 0.5, color: "text.secondary" }}
        >
          {label}:
        </Typography>
        {node}
      </InfoRow>
    );
  });

  return (
    <CardContainer elevation={0} sx={noMarginBottom && { mb: 1 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", rowGap: 8 }}>
        {contents}
      </Box>
    </CardContainer>
  );
}
