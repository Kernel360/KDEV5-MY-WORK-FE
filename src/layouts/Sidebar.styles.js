// src/components/layout/Sidebar.styles.js
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

export const SidebarRoot = styled(Box)(({ theme }) => ({
  width: 200,
  minWidth: 200,
  height: "100vh",
  backgroundColor: theme.palette.text.primary,
  color: theme.palette.background.default,
  display: "flex",
  flexDirection: "column",
  padding: `${theme.spacing(2)} 0 ${theme.spacing(2)} ${theme.spacing(2)}`,
}));

export const ProfileSection = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(1.5),
  "& .MuiAvatar-root": {
    width: 36,
    height: 36,
  },
  "& .profile-text": {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1.2,
  },
  "& .profile-role": {
    fontSize: "0.75rem",
    color: theme.palette.text.secondary,
  },
  "& .profile-name": {
    fontWeight: 600,
    fontSize: "0.9rem",
    color: theme.palette.background.default,
  },
}));

export const NavList = styled(List)(({ theme }) => ({
  flexGrow: 1,
}));

export const NavItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
  "& .MuiListItemButton-root": {
    color: theme.palette.background.default,
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1.2, 2),
    transition: "background-color 0.2s ease",
    "&.Mui-selected": {
      backgroundColor: theme.palette.grey[600],
      color: theme.palette.background.default,
      fontWeight: 600,
    },
  },
  "& .MuiListItemIcon-root": {
    color: theme.palette.background.default,
    minWidth: 40,
  },
}));

export const SectionLabel = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  color: theme.palette.text.secondary,
}));
