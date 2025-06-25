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
        backgroundColor: theme.palette.primary.dark || theme.palette.grey[800],
      },
      "&.Mui-disabled": {
        backgroundColor: theme.palette.grey[100],
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
        borderColor: theme.palette.grey[300],
        backgroundColor: theme.palette.grey[100],
        opacity: 1,
      },
    },
    danger: {
      backgroundColor: theme.palette.status.error.main,
      color: theme.palette.primary.contrastText,
      "&:hover": {
        backgroundColor:
          theme.palette.error.dark || theme.palette.status.error.main,
      },
      "&.Mui-disabled": {
        backgroundColor: theme.palette.status.error.bg,
        color: theme.palette.primary.contrastText,
        opacity: 1,
      },
    },
    "ghost-danger": {
      backgroundColor: "transparent",
      color: theme.palette.status.error.main,
      border: `1px solid ${theme.palette.status.error.main}`,
      "&:hover": {
        backgroundColor: theme.palette.status.error.bg,
      },
      "&.Mui-disabled": {
        color: theme.palette.status.error.main,
        borderColor: theme.palette.status.error.bg,
        backgroundColor: theme.palette.status.error.bg,
        opacity: 1,
      },
    },
    "ghost-info": {
      backgroundColor: "transparent",
      color: theme.palette.status.info.main,
      border: `1px solid ${theme.palette.status.info.main}`,
      "&:hover": {
        backgroundColor: theme.palette.status.info.bg,
      },
      "&.Mui-disabled": {
        color: theme.palette.status.info.main,
        borderColor: theme.palette.status.info.bg,
        backgroundColor: theme.palette.status.info.bg,
        opacity: 1,
      },
    },
    "ghost-success": {
      backgroundColor: "transparent",
      color: theme.palette.status.success.main,
      border: `1px solid ${theme.palette.status.success.main}`,
      "&:hover": {
        backgroundColor: theme.palette.status.success.bg,
      },
      "&.Mui-disabled": {
        color: theme.palette.status.success.main,
        borderColor: theme.palette.status.success.bg,
        backgroundColor: theme.palette.status.success.bg,
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
