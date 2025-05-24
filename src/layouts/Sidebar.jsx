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
  const currentPath = location.pathname;

  const handleItemClick = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <SidebarRoot>
      {/* User Profile */}
      <ProfileSection>
        <Avatar src="/toss_logo.png" />
        <div className="profile-text">
          <span className="profile-role">개발자</span>
          <span className="profile-name">이수하</span>
        </div>
      </ProfileSection>

      {/* Navigation */}
      <NavList>
        {navItems.map(({ text, icon: Icon, path }) => (
          <NavItem
            key={text}
            onClick={() => handleItemClick(path)}
            disablePadding
          >
            <ListItemButton selected={currentPath === path}>
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
