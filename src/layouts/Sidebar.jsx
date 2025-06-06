// src/components/layout/Sidebar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import {
  SidebarRoot,
  ProfileSection,
  NavList,
  NavItem,
} from "./Sidebar.styles";
import navItems from "../../constants/navItems";

import { logout as logoutThunk, clearAuthState } from "@/features/auth/authSlice";

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentPath = location.pathname;

  const handleItemClick = (path) => {
    onClose();
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();

      dispatch(clearAuthState());

      onClose();
      navigate("/login");
    } catch (err) {
      console.error("로그아웃 실패:", err);
    }
  };

  return (
    <SidebarRoot>
      {/* 1. User Profile */}
      <ProfileSection>
        <Avatar src="/toss_logo.png" />
        <div className="profile-text" style={{ marginLeft: 8 }}>
          <Typography variant="body2">
            개발자
          </Typography>
          <Typography variant="subtitle1">이수하</Typography>
        </div>
      </ProfileSection>

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

      <Box sx={{ mt: "auto" }}>
        <NavItem onClick={handleLogout} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <ExitToAppIcon sx={{ color: "background.default" }} />
            </ListItemIcon>
            <ListItemText
              primary="로그아웃"
              primaryTypographyProps={{ color: "background.default" }}
            />
          </ListItemButton>
        </NavItem>
      </Box>
    </SidebarRoot>
  );
}
