// components/PopularRowItem.jsx
import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function PopularRowItem({ rank, title, id }) {
  const navigate = useNavigate();
  const colorKeys = ["error", "warning", "success", "neutral"];
  const colorKey = colorKeys[rank - 1] || "neutral";

  return (
    <Box
      onClick={() => navigate(`/projects/${id}/posts`)}
      sx={(theme) => ({
        p: 1,
        borderRadius: 2,
        transition: "all 0.2s",
        "&:hover": { bgcolor: theme.palette.grey[100] },
        cursor: "pointer",
      })}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={(theme) => ({
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: theme.palette.status[colorKey].bg,
            color: theme.palette.status[colorKey].main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            fontSize: 18,
          })}
        >
          {rank}
        </Box>
        <Typography
          fontWeight={600}
          color="text.primary"
          noWrap
          sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {title}
        </Typography>
      </Stack>
    </Box>
  );
}
