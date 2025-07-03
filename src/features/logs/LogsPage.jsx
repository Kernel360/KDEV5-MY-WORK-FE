import React from 'react';
import { Box } from '@mui/material';
import PageWrapper from '../../components/layouts/pageWrapper/PageWrapper';
import PageHeader from '../../components/layouts/pageHeader/PageHeader';
import LogsTable from './components/LogsTable';

const LogsPage = () => {
  return (
    <PageWrapper>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          borderRadius: 2,
        }}
      >
        <PageHeader
          title="로그 기록"
          subtitle="시스템의 모든 활동 로그를 확인할 수 있습니다."
        />
        <Box sx={{ flex: 1, overflow: "hidden", mb: 0.3 }}>
          <LogsTable />
        </Box>
      </Box>
    </PageWrapper>
  );
};

export default LogsPage; 