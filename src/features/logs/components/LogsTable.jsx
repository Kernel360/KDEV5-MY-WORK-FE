import React, { useState } from 'react';
import CustomTable from '@/components/common/customTable/CustomTable';
import { Box } from '@mui/material';

const LogsTable = () => {
  const [page, setPage] = useState(1);
  const [actionFilterValue, setActionFilterValue] = useState('');
  const [targetTypeFilterValue, setTargetTypeFilterValue] = useState('');

  // 테이블 컬럼 정의
  const columns = [
    { key: 'timestamp', label: '시간', type: 'text' },
    { key: 'actor', label: '액션자 이름', type: 'text' },
    {
      key: 'action',
      label: '액션',
      type: 'status',
      statusMap: {
        create: { color: 'success', label: '생성' },
        modify: { color: 'warning', label: '수정' },
        delete: { color: 'error', label: '삭제' },
      },
    },
    {
      key: 'targetType',
      label: '액션대상타입',
      type: 'text',
    },
    { key: 'content', label: '컨텐츠 요약', type: 'text' },
  ];

  // 임시 데이터 (실제로는 API에서 가져와야 함)
  const logs = [
    {
      id: 1,
      timestamp: '2024-03-20 14:30:00',
      actor: '홍길동',
      action: 'create',
      targetType: '게시글',
      content: '새로운 프로젝트 계획서 작성',
    },
    // ... 더 많은 로그 데이터
  ];

  // 액션 필터 옵션
  const actionFilterOptions = [
    { label: '전체', value: '' },
    { label: '생성', value: 'create' },
    { label: '수정', value: 'modify' },
    { label: '삭제', value: 'delete' },
  ];

  // 액션 대상타입 필터 옵션
  const targetTypeFilterOptions = [
    { label: '전체', value: '' },
    { label: '게시글', value: '게시글' },
    { label: '프로젝트', value: '프로젝트' },
    { label: '회원', value: '회원' },
    { label: '회사', value: '회사' },
  ];

  // 필터링된 데이터
  const filteredLogs = logs.filter(log => {
    const actionMatch = !actionFilterValue || log.action === actionFilterValue;
    const targetTypeMatch = !targetTypeFilterValue || log.targetType === targetTypeFilterValue;
    return actionMatch && targetTypeMatch;
  });

  return (
    <Box>
      <CustomTable
        columns={columns}
        rows={filteredLogs}
        pagination={{
          page,
          total: filteredLogs.length,
          onPageChange: (newPage) => setPage(newPage),
          pageSize: 10,
        }}
        filter={{
          key: 'action',
          label: '액션',
          value: actionFilterValue,
          options: actionFilterOptions,
          onChange: (value) => {
            setActionFilterValue(value);
            setPage(1);
          },
        }}
      />
    </Box>
  );
};

export default LogsTable; 