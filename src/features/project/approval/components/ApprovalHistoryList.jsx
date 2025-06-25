import React, { useState } from "react";
import { Box, Typography, Stack, Paper, IconButton } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function ApprovalHistoryList({ histories }) {
  const [expanded, setExpanded] = useState(true);

  if (!histories || histories.length === 0) return null;

  const getColorByApproval = (approval, theme) => {
    switch (approval) {
      case "APPROVED":
        return theme.palette.success.main;
      case "REJECTED":
        return theme.palette.error.main;
      case "UPDATE_REQUEST":
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          결재 히스토리
        </Typography>
        <IconButton size="small" onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {expanded && (
        <Stack spacing={1.5}>
          {histories.map((history) => (
            <Paper
              key={history.historyId}
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: 2,
                borderColor: (theme) => theme.palette.divider,
                bgcolor: (theme) => theme.palette.grey[50],
              }}
            >
              <Typography
                variant="body2"
                sx={(theme) => ({
                  fontSize: 14,
                  color: theme.palette.text.primary,
                })}
              >
                <Box
                  component="span"
                  sx={{ color: (theme) => theme.palette.text.secondary, mr: 1 }}
                >
                  {history.createdAt}
                </Box>
                <Box component="span" fontWeight={600}>
                  {history.memberName}
                </Box>
                님께서{" "}
                <Box
                  component="span"
                  fontWeight={600}
                  sx={(theme) => ({
                    color: getColorByApproval(history.approval, theme),
                  })}
                >
                  {history.content}
                </Box>
                하였습니다.
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
}
