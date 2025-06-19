import React from "react";
import { Box, Typography, Avatar, Link } from "@mui/material";
import {
  CardContainer,
  InfoRow,
  StatusChip,
  ProgressBar,
} from "./SummaryCard.Styles";
import CustomButton from "@/components/common/customButton/CustomButton"; // 경로는 실제 위치에 맞게 수정

export default function SummaryCard({
  schema = [],
  data = {},
  noMarginBottom = false,
  onClickDetail, // 외부에서 클릭 핸들러 받기
}) {
  const contents = schema.reduce(
    (arr, { key, label, type, colorMap, labelMap }) => {
      const value = data[key];
      if (value == null || (Array.isArray(value) && value.length === 0))
        return arr;

      let node;
      switch (type) {
        case "status": {
          const chipColor = colorMap?.[value];
          const chipLabel = labelMap?.[value] ?? value;
          node = (
            <StatusChip label={chipLabel} size="small" colorKey={chipColor} />
          );
          break;
        }
        case "avatar":
          node = (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={value.avatar}
                sx={{ width: 20, height: 20, mr: 0.5 }}
              />
              <Typography variant="body2">{value.name}</Typography>
            </Box>
          );
          break;
        case "progress":
          node = (
            <Box sx={{ display: "flex", alignItems: "center" }}>
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
            <Link href={value} target="_blank" rel="noopener">
              {value}
            </Link>
          );
          break;
        case "boolean":
          node = (
            <Typography variant="body2">{value ? "예" : "아니오"}</Typography>
          );
          break;
        default:
          node = <Typography variant="body2">{value}</Typography>;
      }

      arr.push(
        <InfoRow
          key={key}
          sx={{ display: "inline-flex", alignItems: "center" }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, mr: 0.5, color: "text.secondary" }}
          >
            {label}:
          </Typography>
          {node}
        </InfoRow>
      );
      return arr;
    },
    []
  );

  return (
    <CardContainer elevation={0} sx={noMarginBottom ? { mb: 1 } : {}}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center", // ✅ 세로 정렬
          flexWrap: "wrap",
          rowGap: 1,
          minHeight: 28, // ✅ 버튼 높이 기준
        }}
      >
        {/* 왼쪽: 정보 목록 */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center", // ✅ 각 InfoRow 정렬
            columnGap: 1,
            rowGap: 1,
            flexGrow: 1,
            minWidth: 50,
            minHeight: 28, // ✅ 버튼 높이 맞춤
          }}
        >
          {contents.map((row, idx) => (
            <React.Fragment key={idx}>
              {row}
              {idx < contents.length - 1 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mx: 1, lineHeight: 1.6 }} // 혹은 display: 'flex' 줘도 됨
                >
                  |
                </Typography>
              )}
            </React.Fragment>
          ))}
        </Box>

        {/* 오른쪽: 버튼 */}
        <CustomButton
          kind="ghost"
          size="small"
          sx={{
            fontSize: "0.75rem",
            height: 28,
            px: 1.5,
            py: 0,
            whiteSpace: "nowrap",
            color: (theme) => theme.palette.text.secondary,
            borderColor: (theme) => theme.palette.grey[300],
            "&:hover": {
              backgroundColor: (theme) => theme.palette.grey[100],
            },
          }}
          onClick={onClickDetail}
        >
          상세 보기
        </CustomButton>
      </Box>
    </CardContainer>
  );
}
