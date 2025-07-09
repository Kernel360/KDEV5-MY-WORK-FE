import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import CustomButton from "@/components/common/customButton/CustomButton";

/**
 * @param {{
 *   selectedEmployees: { id: string, name: string, email?: string, isManager?: boolean, memberRole?: string }[],
 *   onRemove: (id: string) => void,
 *   onToggleManager?: (emp: any) => void
 * }} props
 */
export default function CompanyMemberList({ selectedEmployees, onRemove, onToggleManager }) {
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {emp.name}
              </Typography>
              {['DEV_ADMIN', 'CLIENT_ADMIN', 'SYSTEM_ADMIN', 'ROLE_SYSTEM_ADMIN'].includes(emp.memberRole) && onToggleManager && (
                <CustomButton
                  kind={emp.isManager ? 'danger' : 'ghost-info'}
                  size="small"
                  onClick={() => onToggleManager(emp)}
                  sx={{ minWidth: 64 }}
                >
                  {emp.isManager ? '매니저 해임' : '매니저 임명'}
                </CustomButton>
              )}
            </Box>
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
