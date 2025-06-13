// src/components/layout/Sidebar.jsx
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import { getRoleLabel } from "@/utils/roleUtils";
import {
  logout as logoutThunk,
  clearAuthState,
} from "@/features/auth/authSlice";
import { fetchMemberProjects } from "@/features/member/memberSlice";

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const memberName = useSelector((state) => state.auth.user?.name);
  const memberRole = useSelector((state) => state.auth.user?.role);
  const memberId = useSelector((state) => state.auth.user?.id);

  const memberProjects = useSelector((state) => state.member.memberProjects);
  const projects = useSelector((state) => state.project.data); // 관리자용

  const currentPath = location.pathname;

  const filteredNavItems = navItems.filter(
    (item) => item.roles && item.roles.includes(memberRole)
  );

  // 새로고침 시 memberProjects 재조회
  useEffect(() => {
    if (memberRole === "ROLE_USER" && memberId) {
      dispatch(fetchMemberProjects(memberId));
    }
  }, [memberRole, memberId, dispatch]);

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
      <ProfileSection>
        <Avatar src="/toss_logo.png" />
        <div className="profile-text" style={{ marginLeft: 8 }}>
          <Typography variant="body2">
            {getRoleLabel(memberRole) || ""}
          </Typography>
          <Typography variant="subtitle1">{memberName || ""}</Typography>
        </div>
      </ProfileSection>

      <NavList>
        {memberRole === "ROLE_USER"
          ? memberProjects.map((project) => (
              <NavItem
                key={project.projectId}
                onClick={() =>
                  handleItemClick(`/projects/${project.projectId}`)
                }
                disablePadding
              >
                <ListItemButton
                  selected={currentPath === `/projects/${project.projectId}`}
                >
                  <ListItemText primary={project.projectName} />
                </ListItemButton>
              </NavItem>
            ))
          : filteredNavItems.map(({ text, icon: Icon, path }) => (
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
