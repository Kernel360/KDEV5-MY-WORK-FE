import React from "react";
import { Box, Typography, Chip, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";

const ROLE_LABEL_MAP = {
  DEV_ADMIN: "개발 관리자",
  CLIENT_ADMIN: "클라이언트 관리자",
  SYSTEM_ADMIN: "시스템 관리자",
  ROLE_SYSTEM_ADMIN: "시스템 관리자",
  USER: "일반 사용자",
};

export default function CompanyMemberList({
  selectedEmployees,
  onToggleManager,
}) {
  const theme = useTheme();

  const getRoleChipStyle = (role) => {
    switch (role) {
      case "DEV_ADMIN":
        return {
          bgcolor: theme.palette.status.info.bg,
          color: theme.palette.status.info.main,
        };
      case "CLIENT_ADMIN":
        return {
          bgcolor: theme.palette.status.success.bg,
          color: theme.palette.status.success.main,
        };
      case "SYSTEM_ADMIN":
      case "ROLE_SYSTEM_ADMIN":
        return {
          bgcolor: theme.palette.status.warning.bg,
          color: theme.palette.status.warning.main,
        };
      case "USER":
      default:
        return {
          bgcolor: theme.palette.status.neutral.bg,
          color: theme.palette.status.neutral.main,
        };
    }
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
      {selectedEmployees.map((emp) => {
        const roleLabel = ROLE_LABEL_MAP[emp.memberRole] || emp.memberRole;
        const canToggleManager = emp.memberRole !== "USER";
        return (
          <Box
            key={emp.memberId}
            sx={{
              position: "relative",
              minWidth: 300,
              maxWidth: 300,
              minHeight: 80,
              maxHeight: 80,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              p: 2,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            {/* 토글 버튼 */}
            {canToggleManager && (
              <IconButton
                size="small"
                onClick={() => onToggleManager(emp.memberId)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  color: emp.isManager
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                }}
              >
                {emp.isManager ? (
                  <PersonRemoveOutlinedIcon fontSize="small" />
                ) : (
                  <PersonAddOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {emp.memberName || emp.name}
              </Typography>
              {emp.memberRole && (
                <Chip
                  label={roleLabel}
                  size="small"
                  variant="filled"
                  sx={{
                    fontSize: 12,
                    height: 22,
                    ...getRoleChipStyle(emp.memberRole),
                    borderRadius: 1,
                    fontWeight: 500,
                  }}
                />
              )}
              {emp.isManager && (
                <Chip
                  label="담당자"
                  size="small"
                  color="filled"
                  sx={{
                    fontSize: 12,
                    height: 22,
                    bgcolor: theme.palette.status.error.bg,
                    color: theme.palette.status.error.main,
                    borderRadius: 1,
                    fontWeight: 500,
                  }}
                />
              )}
            </Box>

            {emp.email && (
              <Typography variant="caption" color="text.secondary" noWrap>
                {emp.email}
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
