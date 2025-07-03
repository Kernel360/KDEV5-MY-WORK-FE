import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";

/**
 * @param {{
 *   selectedEmployees: { id: string, name: string, email?: string }[],
 *   onRemove: (id: string) => void
 * }} props
 */
export default function CompanyMemberList({ selectedEmployees, onRemove }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        mb: 1.5,
      }}
    >
      {selectedEmployees.map((emp) => (
        <Box
          key={emp.id}
          sx={{
            minWidth: 300,
            maxWidth: 300,
            minHeight: 80,
            maxHeight: 80,
            flex: "1 0 120px",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: theme.palette.background.paper,
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {emp.name}
            </Typography>
            {emp.email && (
              <Typography variant="caption" color="text.secondary" noWrap>
                {emp.email}
              </Typography>
            )}
          </Box>
          <IconButton
            size="small"
            onClick={() => onRemove(emp.id)}
            sx={{ color: theme.palette.error.main }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}
