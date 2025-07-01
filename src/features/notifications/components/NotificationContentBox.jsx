import React from "react";
import { Box, Typography } from "@mui/material";
import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";
import { typeIconKeyMap } from "@/utils/notificationIconMap";

const iconComponentMap = {
  AssignmentTurnedInRounded: AssignmentTurnedInRoundedIcon,
  FeedRounded: FeedRoundedIcon,
};

export default function NotificationContentBox({ targetType, content, isUnread = false }) {
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
        backgroundColor: isUnread ? "#fafafa" : "background.default",
        border: "1px solid",
        borderColor: isUnread ? "#e8e8e8" : "divider",
        boxShadow: isUnread ? "0 1px 3px rgba(0, 0, 0, 0.04)" : "none",
      }}
    >
      {IconComponent && (
        <IconComponent
          fontSize="small"
          sx={{
            color: isUnread ? "text.primary" : "text.secondary",
            flexShrink: 0,
          }}
        />
      )}
      <Typography
        variant="body2"
        color={isUnread ? "text.primary" : "text.secondary"}
        sx={{
          fontSize: 13,
          lineHeight: 1.6,
          wordBreak: "keep-all",
          whiteSpace: "pre-wrap",
          fontWeight: isUnread ? 500 : 400,
        }}
      >
        {content}
      </Typography>
    </Box>
  );
}
