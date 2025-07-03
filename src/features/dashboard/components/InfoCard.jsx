// components/InfoCard.jsx
import React from "react";
import { Box, Paper, Stack, Typography, Chip } from "@mui/material";

export default function InfoCard({ icon, label, value, color }) {
  return (
    <Paper
      sx={{
        flex: 1,
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          fontSize: 32,
          color: (theme) => theme.palette.status[color]?.main,
          display: "flex",
          alignItems: "center",
        }}
      >
        {icon}
      </Box>
      <Stack spacing={0.5} sx={{ flex: 1 }}>
        <Chip
          label={label}
          sx={(theme) => ({
            width: "fit-content",
            height: 24,
            fontSize: 12,
            fontWeight: 500,
            bgcolor: theme.palette.status[color]?.bg,
            color: theme.palette.status[color]?.main,
            border: "none",
          })}
        />
        <Typography variant="h5" fontWeight={700} color="text.primary">
          {value}
        </Typography>
      </Stack>
    </Paper>
  );
}
