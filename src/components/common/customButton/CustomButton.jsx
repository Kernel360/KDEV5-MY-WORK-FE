// src/components/common/CustomButton.jsx
import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledButton = styled(Button)(({ theme, kind }) => {
  const base = {
    borderRadius: 8,
    textTransform: "none",
    fontWeight: 500,
    boxShadow: "none",
  };

  const kinds = {
    primary: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
      "&.Mui-disabled": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        opacity: 0.5,
      },
    },
    ghost: {
      backgroundColor: "transparent",
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.text.primary}`,
      "&:hover": {
        backgroundColor: theme.palette.grey[100],
      },
      "&.Mui-disabled": {
        color: theme.palette.action.disabled,
        borderColor: theme.palette.action.disabledBackground,
      },
    },
    danger: {
      backgroundColor: theme.palette.error.main,
      color: "#fff",
      "&:hover": {
        backgroundColor: theme.palette.error.dark,
      },
      "&.Mui-disabled": {
        backgroundColor: theme.palette.error.main,
        color: "#fff",
        opacity: 0.5,
      },
    },
    "ghost-danger": {
      backgroundColor: "transparent",
      color: theme.palette.error.main,
      border: `1px solid ${theme.palette.error.main}`,
      "&:hover": {
        backgroundColor: theme.palette.error.light,
      },
      "&.Mui-disabled": {
        color: theme.palette.error.main,
        borderColor: theme.palette.error.main,
        opacity: 0.5,
      },
    },
    text: {
      backgroundColor: "transparent",
      color: theme.palette.text.primary,
      border: "none",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: theme.palette.grey[100],
      },
      "&.Mui-disabled": {
        color: theme.palette.action.disabled,
      },
    },
  };

  return {
    ...base,
    ...(kinds[kind] || kinds.primary),
  };
});

export default function CustomButton({
  children,
  kind = "primary",
  size = "medium",
  fullWidth = false,
  startIcon,
  endIcon,
  ...props
}) {
  return (
    <StyledButton
      kind={kind}
      size={size}
      fullWidth={fullWidth}
      startIcon={startIcon}
      endIcon={endIcon}
      {...props}
    >
      {children}
    </StyledButton>
  );
}
