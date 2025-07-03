// components/RowItem.jsx
import React from "react";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function RowItem({ name, endAt, dday, id }) {
  const navigate = useNavigate();

  const getColorKey = (dday) => {
    if (dday <= 1) return "error";
    if (dday <= 3) return "warning";
    return "success";
  };

  const colorKey = getColorKey(dday);

  return (
    <Box
      onClick={() => navigate(`/projects/${id}/posts`)}
      sx={(theme) => ({
        cursor: "pointer",
        "&:hover": { bgcolor: theme.palette.grey[100] },
        borderRadius: 1,
        borderColor: "divider",
        p: 1,
      })}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography fontWeight={500} color="text.primary">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            종료 예정일: {dayjs(endAt).format("YYYY-MM-DD")}
          </Typography>
        </Box>
        <Chip
          label={`D-${dday}`}
          variant="filled"
          sx={(theme) => ({
            borderRadius: 1,
            fontWeight: 500,
            bgcolor: theme.palette.status[colorKey].bg,
            color: theme.palette.status[colorKey].main,
          })}
        />
      </Stack>
    </Box>
  );
}
