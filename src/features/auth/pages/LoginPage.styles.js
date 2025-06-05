import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";

export const RootBox = styled(Box)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: theme.palette.text.primary,
}));

export const LoginPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  width: 360,
  borderRadius: 12,
  backgroundColor: theme.palette.background.paper,
}));

export const LoginButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.grey[700],
  },
}));