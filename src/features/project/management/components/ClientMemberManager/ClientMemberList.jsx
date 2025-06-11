// src/components/ClientMemberList.jsx
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';

export default function ClientMemberList({ selectedEmployees = [], onRemove }) {
  const theme = useTheme();

  // selectedEmployees가 undefined일 때를 방지하기 위해 기본값 [] 사용
  if (!Array.isArray(selectedEmployees) || selectedEmployees.length === 0) {
    return null; // 항목이 없으면 아무것도 렌더링하지 않음
  }

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
               maxWidth: 300,
               maxHeight: 80,
            flex: '1 0 140px',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.background.paper,
            boxSizing: 'border-box'
          }}
        >
          {/* 직원 이름과 이메일 */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, maxWidth: 'calc(100% - 40px)' }}>
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

          {/* 삭제 버튼 */}
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
