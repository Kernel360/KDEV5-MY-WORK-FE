// src/components/StepCard.jsx
import React from "react";
import { Card, Typography, Chip, IconButton, Box } from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTheme as useMuiTheme } from "@mui/material/styles";

export default function StepCard({ id, label, index, onEdit, isNew, isEdit }) {
  const theme = useMuiTheme();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
    userSelect: "none",
  };

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      sx={{
        ...style,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        p: 2,
        boxShadow: "none",
        minWidth: 160,
        maxWidth: 180,
        borderRadius: 2,
        flex: "0 0 auto",
        bgcolor: isDragging
          ? theme.palette.background.default
          : theme.palette.background.paper,
        border: isNew
          ? `1px dashed ${theme.palette.status.info.main}`
          : isEdit
            ? `1px dashed ${theme.palette.status.warning.main}`
            : `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* 번호 + 수정 버튼 + 신규 Chip */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Chip
          label={index}
          size="small"
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 600,
            width: 24,
            height: 24,
            "& .MuiChip-label": { padding: 0 },
          }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <IconButton
            size="small"
            aria-label="단계 이름 수정"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onEdit?.(id)}
            sx={{ p: 0 }}
          >
            <EditRoundedIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}>
        {isEdit && !isNew && (
          <Chip
            label="Edited"
            size="small"
            sx={{
              fontSize: "0.7rem",
              height: 20,
              fontWeight: 500,
              borderRadius: 1,
              bgcolor:
                theme.palette.status?.warning?.bg ||
                theme.palette.warning.light,
              color:
                theme.palette.status?.warning?.main ||
                theme.palette.warning.main,
            }}
          />
        )}

        {isNew && (
          <Chip
            label="New"
            size="small"
            sx={{
              fontSize: "0.7rem",
              height: 20,
              fontWeight: 500,
              borderRadius: 1,
              bgcolor: theme.palette.status.info.bg,
              color: theme.palette.status.info.main,
            }}
          />
        )}
        <Typography
          variant="body1"
          sx={{
            textAlign: "left",
            fontWeight: 500,
            fontSize: { xs: 14, sm: 15 },
          }}
        >
          {label}
        </Typography>
      </Box>
    </Card>
  );
}
