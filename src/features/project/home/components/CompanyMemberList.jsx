import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

const ROLE_LABEL_MAP = {
  DEV_ADMIN: "개발 관리자",
  CLIENT_ADMIN: "클라이언트 관리자",
  SYSTEM_ADMIN: "시스템 관리자",
  ROLE_SYSTEM_ADMIN: "시스템 관리자",
  USER: "일반 사용자",
};

export default function CompanyMemberList({
  selectedEmployees,
  onRemove,
  onToggleManager,
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuTarget, setMenuTarget] = useState(null);

  const handleMenuOpen = (event, emp) => {
    setAnchorEl(event.currentTarget);
    setMenuTarget(emp);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuExited = () => {
    setMenuTarget(null);
  };

  const handleToggleManager = () => {
    if (onToggleManager && menuTarget) {
      onToggleManager(menuTarget);
    }
    handleMenuClose();
  };

  const handleRemove = () => {
    if (onRemove && menuTarget) {
      onRemove(menuTarget.id);
    }
    handleMenuClose();
  };

  // 역할 색상 매핑
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
        return (
          <Box
            key={emp.id}
            sx={{
              minWidth: 300,
              maxWidth: 300,
              minHeight: 80,
              maxHeight: 100,
              flex: "1 0 120px",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              backgroundColor: theme.palette.background.paper,
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ flex: 1, overflow: "hidden" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {emp.name}
                  </Typography>

                  {/* 역할 Chip */}
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

                  {/* 매니저 Chip */}
                  {emp.isManager && (
                    <Chip
                      label="매니저"
                      size="small"
                      variant="filled"
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

              <IconButton size="small" onClick={(e) => handleMenuOpen(e, emp)}>
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        );
      })}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onExited={handleMenuExited}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {onToggleManager && menuTarget?.memberRole !== "USER" && (
          <MenuItem onClick={handleToggleManager}>
            <PersonAddAltRoundedIcon fontSize="small" sx={{ mr: 1 }} />
            {menuTarget?.isManager ? "매니저 해임" : "매니저로 임명"}
          </MenuItem>
        )}
        <MenuItem
          onClick={handleRemove}
          sx={{ color: theme.palette.error.main }}
        >
          <DeleteRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          삭제
        </MenuItem>
      </Menu>
    </Box>
  );
}
