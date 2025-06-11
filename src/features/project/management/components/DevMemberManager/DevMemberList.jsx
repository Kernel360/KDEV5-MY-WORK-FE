// src/components/ProjectMemberList.jsx
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';  // 변경: DeleteIcon 사용
import { useTheme } from '@mui/material/styles';

export default function DevMemberList({ selectedEmployees, onRemove }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      {selectedEmployees.map((emp, idx) => (
        <Box
          key={emp.id}
          sx={{
            flex: '1 0 120px',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {idx + 1}
            </Box>
            <Typography variant="body2" fontWeight={500}>
              {emp.name}
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => onRemove(emp.id)}           // 변경: onRemove 호출
            sx={{ color: theme.palette.error.main }}  // 삭제니 에러 컬러
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}
