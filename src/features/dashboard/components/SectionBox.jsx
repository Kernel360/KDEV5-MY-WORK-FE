import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";

export default function SectionBox({
  icon,
  title,
  children,
  iconColor = "primary.main",
  height = 300,
}) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <Box
          fontSize={20}
          color={iconColor}
          sx={{ display: "flex", alignItems: "center" }}
        >
          {icon}
        </Box>
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          {title}
        </Typography>
      </Stack>
      {children}
    </Paper>
  );
}
