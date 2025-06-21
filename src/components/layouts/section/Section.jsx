// src/components/Section.jsx
import React from "react";
import { Box, Stack, Divider, Typography, Tooltip, Grid } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

export default function Section({
  index,
  title,
  tooltip,
  action,
  spacing = 3,
  items = [],
  children,
}) {
  return (
    <Box sx={{ my: 1, width: "100%" }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" fontWeight={600}>
            {index}. {title}
          </Typography>
          {tooltip && (
            <Tooltip title={tooltip}>
              <InfoOutlined fontSize="small" color="action" />
            </Tooltip>
          )}
        </Stack>

        {action && <Box>{action}</Box>}
      </Stack>

      <Divider sx={{ mt: 1, mb: 2 }} />

      <Grid container spacing={spacing}>
        {items.map(({ label, value, gridProps }, idx) => (
          <Grid key={idx} item xs={12} sm={6} {...gridProps}>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="body1">{value || "-"}</Typography>
          </Grid>
        ))}
        {children}
      </Grid>
    </Box>
  );
}
