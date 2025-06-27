import React from "react";
import { Box, Typography } from "@mui/material";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";
import { typeIconKeyMap } from "@/utils/notificationIconMap";

const iconComponentMap = {
  AssignmentTurnedInRounded: AssignmentTurnedInRoundedIcon,
  FeedRounded: FeedRoundedIcon,
};

export default function NotificationContentBox({ targetType, content }) {
  if (!content) return null;

  const IconComponent = iconComponentMap[typeIconKeyMap[targetType]];

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 1.5,
        py: 1.25,
        borderRadius: 2,
        backgroundColor: "background.default",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {IconComponent && (
        <IconComponent
          fontSize="small"
          sx={{
            color: "text.secondary",
            flexShrink: 0,
          }}
        />
      )}
      <Typography
        variant="body2"
        color="text.primary"
        sx={{
          fontSize: 13,
          lineHeight: 1.6,
          wordBreak: "keep-all",
          whiteSpace: "pre-wrap",
        }}
      >
        {content}
      </Typography>
    </Box>
  );
}
