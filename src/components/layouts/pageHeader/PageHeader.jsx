import { Box, Typography, Button } from "@mui/material";

export default function PageHeader({
  title,
  subtitle,
  action,
  noPaddingBottom = false,
}) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={3}
      pt={3}
      pb={noPaddingBottom ? 0 : 3}
    >
      <Box>
        <Typography variant="h3" fontWeight={600}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}
