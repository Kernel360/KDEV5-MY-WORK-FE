// src/components/Section.jsx
import React from "react";
import { Box, Stack, Divider, Typography, Tooltip } from "@mui/material";
import { InfoOutlined } from "@mui/icons-material";

export default function Section({ 
  index, 
  title, 
  tooltip, 
  action,       // 추가된 prop
  children 
}) {
  return (
    <Box sx={{ my: 1, width: "100%" }}>
      <Stack 
        direction="row" 
        alignItems="center" 
        justifyContent="space-between"   // 제목과 액션 버튼 양 끝 배치
        spacing={1}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" fontWeight={600}>
            {index}. {title}
          </Typography>
          {tooltip && (
            <Tooltip title={tooltip}>
              <InfoOutlined fontSize="small" color="action" />
            </Tooltip>
          )}
        </Stack>

        {action && (
          <Box>
            {action}
          </Box>
        )}
      </Stack>

      <Divider sx={{ mt: 1, mb: 2 }} />
      {children}
    </Box>
  );
}
