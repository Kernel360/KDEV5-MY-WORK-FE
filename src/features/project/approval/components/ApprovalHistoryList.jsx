import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Paper,
  IconButton,
  useTheme,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const getApprovalLabel = (approval) => {
  switch (approval) {
    case "APPROVED":
      return "승인";
    case "REJECTED":
      return "반려";
    case "REQUEST_CHANGES":
      return "수정 요청";
    case "PENDING":
      return "체크리스트를 새로 작성";
    default:
      return approval;
  }
};

const getColorByApproval = (approval, theme) => {
  switch (approval) {
    case "APPROVED":
      return theme.palette.success.main;
    case "REJECTED":
      return theme.palette.error.main;
    case "REQUEST_CHANGES":
      return theme.palette.info.main;
    case "PENDING":
      return theme.palette.warning.main;
    default:
      return theme.palette.text.secondary;
  }
};

export default function ApprovalHistoryList({ histories }) {
  const [expanded, setExpanded] = useState(true);
  const theme = useTheme();

  if (!histories || histories.length === 0) return null;

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
          {histories.map((history) => {
            const label = getApprovalLabel(history.approval);
            const color = getColorByApproval(history.approval, theme);
            const isPending = history.approval === "PENDING";

            return (
              <Paper
                key={history.historyId}
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: theme.palette.background.paper,
                  borderColor: theme.palette.divider,
                }}
              >
                <Stack spacing={1}>
                  <Typography
                    variant="caption"
                    sx={{ color: theme.palette.text.disabled }}
                  >
                    {history.createdAt}
                  </Typography>

                  <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                    <Typography component="span" fontWeight={600}>
                      {history.memberName}
                    </Typography>
                    {isPending ? (
                      <>
                        {" "}
                        님이{" "}
                        <Typography
                          component="span"
                          fontWeight={600}
                          sx={{ color }}
                        >
                          {label}
                        </Typography>
                        하였습니다.
                      </>
                    ) : (
                      <>
                        {" "}
                        님이{" "}
                        <Typography
                          component="span"
                          fontWeight={600}
                          sx={{ color }}
                        >
                          {label}
                        </Typography>
                        하였습니다.
                      </>
                    )}
                  </Typography>

                  {!isPending && history.reason && (
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary, fontSize: 13 }}
                    >
                      사유: {history.reason}
                    </Typography>
                  )}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}
