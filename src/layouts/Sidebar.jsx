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
  const currentPath = location.pathname;

  const filteredNavItems = navItems.filter(
    (item) => item.roles && item.roles.includes(memberRole)
  );

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
        {memberRole === "ROLE_USER" ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
              프로젝트
            </Typography>
            {memberProjects.map((project) => (
              <NavItem
                key={project.projectId}
                onClick={() =>
                  handleItemClick(`/projects/${project.projectId}`)
                }
                disablePadding
                sx={{ mb: 0.5 }}
              >
                <ListItemButton
                  selected={currentPath === `/projects/${project.projectId}`}
                  sx={{ borderRadius: 1, px: 1.5, py: 0.8 }}
                >
                  <ListItemText
                    primary={project.projectName}
                    primaryTypographyProps={{
                      noWrap: true,
                      sx: { fontSize: 14 },
                    }}
                  />
                </ListItemButton>
              </NavItem>
            ))}
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            {filteredNavItems.map(({ text, icon: Icon, path, children }) => (
              <Box key={text} sx={{ mb: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 1, pl: 1 }}
                >
                  {text}
                </Typography>

                {/* 상위가 children이 없는 경우는 단일 메뉴 처리 */}
                {!children && (
                  <NavItem
                    disablePadding
                    onClick={() => handleItemClick(path)}
                    sx={{ mb: 0.5 }}
                  >
                    <ListItemButton
                      selected={currentPath === path}
                      sx={{ borderRadius: 1, px: 1.5, py: 0.8 }}
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

                {/* children 있는 경우 하위 메뉴 리스트 노출 */}
                {children?.map(
                  ({ text: childText, icon: ChildIcon, path: childPath }) => (
                    <NavItem
                      key={childText}
                      disablePadding
                      onClick={() => handleItemClick(childPath)}
                      sx={{ pl: 3, mb: 0.5 }}
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
              </Box>
            ))}
          </Box>
        )}
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
