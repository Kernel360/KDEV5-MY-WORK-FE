import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  IconButton,
  Badge,
} from "@mui/material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";

import {
  SidebarRoot,
  ProfileSection,
  NavList,
  NavItem,
} from "./Sidebar.styles";
import navItems from "@/constants/navItems";
import { getRoleLabel } from "@/utils/roleUtils";
import {
  logout as logoutThunk,
  clearAuthState,
} from "@/features/auth/authSlice";

export default function Sidebar({
  onClose,
  onNotificationsClick,
  unreadCount,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const memberName = useSelector((state) => state.auth.user?.name);
  const memberRole = useSelector((state) => state.auth.user?.role);
  const currentPath = location.pathname;

  const filteredNavItems = navItems.filter(
    (item) => item.roles && item.roles.includes(memberRole)
  );

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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: 1,
            justifyContent: "space-between",
          }}
        >
          <div className="profile-text" style={{ marginLeft: 8 }}>
            <Typography variant="body2">
              {getRoleLabel(memberRole) || ""}
            </Typography>
            <Typography variant="subtitle1">{memberName || ""}</Typography>
          </div>
          <IconButton size="small" onClick={onNotificationsClick}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsRoundedIcon
                fontSize="small"
                sx={{ color: "grey.400" }}
              />
            </Badge>
          </IconButton>
        </Box>
      </ProfileSection>

      <NavList>
        <Box>
          {filteredNavItems.map(({ text, icon: Icon, path, children }) => (
            <Box key={text} sx={{ mb: 2 }}>
              {/* 상위 메뉴 */}
              {!children && (
                <NavItem disablePadding onClick={() => handleItemClick(path)}>
                  <ListItemButton
                    selected={currentPath === path}
                    sx={{ borderRadius: 1, px: 1, py: 0.8 }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      primaryTypographyProps={{
                        noWrap: true,
                        sx: { fontSize: 14 },
                      }}
                    />
                  </ListItemButton>
                </NavItem>
              )}

              {/* 하위 메뉴 */}
              {children && (
                <>
                  <Typography
                    variant="caption"
                    color="primary.contrastText"
                    sx={{ pl: 1 }}
                  >
                    {text}
                  </Typography>

                  {children.map(
                    ({ text: childText, icon: ChildIcon, path: childPath }) => (
                      <NavItem
                        key={childText}
                        disablePadding
                        onClick={() => handleItemClick(childPath)}
                        sx={{ pl: 3 }}
                      >
                        <ListItemButton
                          selected={currentPath === childPath}
                          sx={{ borderRadius: 1, px: 1.5, py: 0.8 }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <ChildIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={childText}
                            primaryTypographyProps={{
                              noWrap: true,
                              sx: { fontSize: 14 },
                            }}
                          />
                        </ListItemButton>
                      </NavItem>
                    )
                  )}
                </>
              )}
            </Box>
          ))}
        </Box>
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
