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
    },
    ghost: {
      backgroundColor: "transparent",
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.divider}`,
      "&:hover": {
        backgroundColor: theme.palette.grey[100],
      },
    },
    danger: {
      backgroundColor: theme.palette.error.main,
      color: "#fff",
      "&:hover": {
        backgroundColor: theme.palette.error.dark,
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
