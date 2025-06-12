import React from 'react';
import { Box, Typography, Stack, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function CompanyMemberList({ members = [] }) {
  const theme = useTheme();

  if (!Array.isArray(members) || members.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        maxHeight: '400px',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: theme.palette.background.default,
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme.palette.divider,
          borderRadius: '4px',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          mb: 1.5,
        }}
      >
        {members.map((member) => (
          <Box
            key={member.id}
            sx={{
              width: 320,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
              p: 2,
              backgroundColor: theme.palette.background.paper,
              boxSizing: 'border-box',
            }}
          >
            <Stack spacing={1.5}>
              {/* 이름과 이메일 */}
              <Box>
                <Typography variant="subtitle2" fontWeight={600} noWrap>
                  {member.name}
                </Typography>
                {member.email && (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {member.email}
                  </Typography>
                )}
              </Box>

              {/* 직급과 부서 */}
              <Grid container spacing={2}>
                {member.position && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      직급
                    </Typography>
                    <Typography variant="body2" noWrap>
                      {member.position}
                    </Typography>
                  </Grid>
                )}
                {member.department && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      부서
                    </Typography>
                    <Typography variant="body2" noWrap>
                      {member.department}
                    </Typography>
                  </Grid>
                )}
              </Grid>

              {/* 전화번호와 생성일 */}
              <Grid container spacing={2}>
                {member.phoneNumber && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      연락처
                    </Typography>
                    <Typography variant="body2" noWrap>
                      {member.phoneNumber}
                    </Typography>
                  </Grid>
                )}
                {member.createdAt && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      등록일
                    </Typography>
                    <Typography variant="body2" noWrap>
                      {new Date(member.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  );
} 