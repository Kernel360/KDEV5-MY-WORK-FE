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
        backgroundColor: "#eaeaea",
        color: theme.palette.text.disabled,
        opacity: 1,
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
        color: theme.palette.text.disabled,
        borderColor: "#d5d5d5",
        backgroundColor: "#f9f9f9",
        opacity: 1,
      },
    },
    danger: {
      backgroundColor: theme.palette.error.main,
      color: "#fff",
      "&:hover": {
        backgroundColor: theme.palette.error.dark,
      },
      "&.Mui-disabled": {
        backgroundColor: "#f0c8c8",
        color: "#fff",
        opacity: 1,
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
        color: "#d44c4c",
        borderColor: "#f3bcbc",
        backgroundColor: "#fdf3f3",
        opacity: 1,
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
        color: theme.palette.text.disabled,
        backgroundColor: "transparent",
        opacity: 1,
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
