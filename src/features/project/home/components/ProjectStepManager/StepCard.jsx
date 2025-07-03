// src/components/StepCard.jsx
import React from "react";
import { Card, Typography, Chip, IconButton, Box } from "@mui/material";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTheme as useMuiTheme } from "@mui/material/styles";

export default function StepCard({ id, label, index, onEdit }) {
  const theme = useMuiTheme();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
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
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        minWidth: 160,
        maxWidth: 180,
        bgcolor: isDragging ? theme.palette.background.default : theme.palette.background.paper,
        borderRadius: 2,
        flex: '0 0 auto',
      }}
    >
      {/* 번호 표시와 편집 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Chip
          label={index}
          size="small"
          sx={{
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: 600,
            width: 24,
            height: 24,
            '& .MuiChip-label': { padding: 0 },
          }}
        />
        <IconButton size="small"  aria-label="단계 이름 수정"   onPointerDown={(e) => e.stopPropagation()} onClick={() => onEdit?.(id)} sx={{ p: 0 }}>
          <EditRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* 단계 제목 */}
      <Typography
        variant="body1"
        sx={{ mt: 1, textAlign: 'left', fontWeight: 500, fontSize: { xs: 14, sm: 15 } }}
      >
        {label}
      </Typography>
    </Card>
  );
}
