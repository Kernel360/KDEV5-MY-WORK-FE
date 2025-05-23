// src/components/layout/Sidebar.styles.js
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

export const SidebarRoot = styled(Box)(({ theme }) => ({
  width: 200,
  height: "100vh",
  backgroundColor: "#1A1A1A",
  color: "#ffffff",
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
}));

export const ProfileSection = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing(2), // avatar and text spacing
  marginBottom: theme.spacing(3), // space below profile section
  "& .MuiAvatar-root": {
    width: 36,
    height: 36,
  },
}));

export const NavList = styled(List)(({ theme }) => ({
  flexGrow: 1,
}));

export const NavItem = styled(ListItem)(({ theme }) => ({
  padding: 0,
  "& .MuiListItemButton-root": {
    color: "#ffffff",
  },
  "& .MuiListItemIcon-root": {
    color: "#ffffff",
    minWidth: 40,
  },
}));

export const SectionLabel = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  color: "#B0B0B0",
}));
