// src/components/layout/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
} from "@mui/material";
import {
  SidebarRoot,
  ProfileSection,
  NavList,
  NavItem,
} from "./Sidebar.styles";
import navItems from "../../constants/navItems";

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const handleItemClick = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <SidebarRoot>
      {/* User Profile */}
      <ProfileSection spacing={2}>
        <Avatar src="/finalytic_logo.png" />
        <Box>
          <Typography variant="caption" color="text.secondary">
            Team
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            Finalytic
          </Typography>
        </Box>
      </ProfileSection>

      {/* Navigation */}
      <NavList>
        {navItems.map(({ text, icon: Icon, path }) => (
          <NavItem
            key={text}
            onClick={() => handleItemClick(path)}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </NavItem>
        ))}
      </NavList>
    </SidebarRoot>
  );
}
