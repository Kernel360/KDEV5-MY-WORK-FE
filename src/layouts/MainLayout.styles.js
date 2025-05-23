// src/components/layout/Layout.styles.js
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";

export const Root = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100vh",
  backgroundColor: "#1A1A1A",
  position: "relative",
}));

export const MobileToggleButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: theme.spacing(3),
  left: theme.spacing(3),
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#1A1A1A",
  color: "#ffffff",
  borderRadius: "50%",
  "&:hover": {
    backgroundColor: "#333333",
  },
}));

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    width: 200,
    backgroundColor: "#1A1A1A",
  },
}));

export const Main = styled(Box)(({ theme }) => ({
  component: "main",
  position: "relative",
  flexGrow: 1,
  margin: theme.spacing(2),
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: "#ffffff",
  height: `calc(100% - ${theme.spacing(4)})`,
  overflowY: "auto",
}));
