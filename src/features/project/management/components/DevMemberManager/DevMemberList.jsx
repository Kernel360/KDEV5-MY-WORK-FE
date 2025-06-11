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
        gap: 1,
        mb: 1.5,
      }}
    >
      {selectedEmployees.map((emp, idx) => (
        <Box
          key={emp.id}
          sx={{
               minWidth: 300,
               maxWidth: 300,
   minHeight: 80,
               maxHeight: 80,
            flex: '1 0 120px',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.background.paper,
            boxSizing: 'border-box',
          }}
        >
             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {emp.name}
                      </Typography>
                      {/* email이 없을 수도 있으니 안전 호출 */}
                      {emp.email && (
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {emp.email}
                        </Typography>
                      )}
                    </Box>
          <IconButton
            size="small"
            onClick={() => onRemove(emp.id)}           
            sx={{ color: theme.palette.error.main }}  
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}
