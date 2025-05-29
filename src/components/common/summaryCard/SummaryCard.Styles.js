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
