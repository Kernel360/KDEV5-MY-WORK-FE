import { Paper } from "@mui/material";

export default function PageWrapper({ children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "background.default",
        borderRadius: 4,
      }}
    >
      {children}
    </Paper>
  );
}
