// SummaryCard.styles.js

export const cardContainerSx = {
  backgroundColor: "background.paper",
  px: 3,
  py: 2,
  borderRadius: 3,
  border: "1px solid",
  borderColor: "divider",
  my: 1.5,
  mx: 3,
};

export const statusChipSx = (color) => ({
  bgcolor: color.bg,
  color: color.main,
  fontWeight: 500,
  px: 1.2,
  height: 20,
  fontSize: 12,
});

export const customChipSx = (color, theme) => ({
  bgcolor: color?.bg || theme.palette.grey[100],
  color: color?.main || theme.palette.text.primary,
  fontWeight: 500,
  px: 1.2,
  height: 20,
  fontSize: 12,
});

export const progressSx = (theme, value) => ({
  height: 6,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[200],
  "& .MuiLinearProgress-bar": {
    backgroundColor:
      value > 0 ? theme.palette.primary.main : theme.palette.grey[400],
  },
});

export const infoRowSx = {
  flexShrink: 0,
};

export const infoLabelSx = {
  fontWeight: 500,
  color: "text.secondary",
  whiteSpace: "nowrap",
};

export const infoValueSx = {
  fontWeight: 400,
};
// src/components/common/summaryCard/SummaryCard.styles.js
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";

export const CardContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2, 3),
  borderRadius: theme.shape.borderRadius * 1.5,
  border: `1px solid ${theme.palette.divider}`,
  margin: theme.spacing(1.5, 3),
}));

export const InfoRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  "& + &": {
    marginLeft: theme.spacing(2),
  },
}));

export const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "colorKey",
})(({ theme, colorKey }) => {
  const col = theme.palette.status[colorKey] || theme.palette.status.neutral;
  return {
    backgroundColor: col.bg,
    color: col.main,
    fontWeight: 500,
    padding: theme.spacing(0, 1),
    height: 20,
    fontSize: 12,
  };
});

export const ProgressBar = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== "barValue",
})(({ theme, barValue }) => ({
  height: 6,
  borderRadius: 4,
  backgroundColor: theme.palette.grey[200],
  "& .MuiLinearProgress-bar": {
    backgroundColor:
      barValue > 0 ? theme.palette.primary.main : theme.palette.grey[400],
  },
}));
