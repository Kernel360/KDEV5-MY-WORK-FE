import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Alert, 
  CircularProgress, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Divider,
  Chip
} from '@mui/material';
import CustomTable from '@/components/common/customTable/CustomTable';
import { 
  fetchActivityLogs, 
  setCurrentPage, 
  clearLogsError,
  setActionTypeFilter,
  setTargetTypeFilter
} from '../logsSlice';

const LogsTable = () => {
  const dispatch = useDispatch();
  const { 
    activityLogs, 
    totalCount, 
    currentPage, 
    actionTypeFilter,
    targetTypeFilter,
    loading, 
    error 
  } = useSelector((state) => state.logs);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedLogDetails, setSelectedLogDetails] = useState([]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    dispatch(fetchActivityLogs({ 
      page: currentPage, 
      actionType: actionTypeFilter, 
      targetType: targetTypeFilter 
    }));
  }, [dispatch, currentPage, actionTypeFilter, targetTypeFilter]);

  // 에러 발생 시 5초 후 자동으로 에러 메시지 제거
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearLogsError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // 상세보기 팝업 열기
  const handleShowDetails = (logDetails) => {
    // UNKNOWN_FIELD_TYPE 제외
    const filteredDetails = logDetails.filter(detail => detail.fieldType !== 'UNKNOWN_FIELD_TYPE');
    setSelectedLogDetails(filteredDetails);
    setDetailsOpen(true);
  };

  // 상세보기 팝업 닫기
  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedLogDetails([]);
  };

  // 테이블 컬럼 정의
  const columns = [
    { key: 'actionTime', label: '시간', type: 'text' },
    { key: 'actorName', label: '액션자 이름', type: 'text' },
    {
      key: 'actionType',
      label: '액션',
      type: 'status',
      statusMap: {
        CREATE: { color: 'success', label: '생성' },
        MODIFY: { color: 'warning', label: '수정' },
        DELETE: { color: 'error', label: '삭제' },
      },
    },
    {
      key: 'targetType',
      label: '액션대상타입',
      type: 'text',
    },
    { key: 'actorCompanyName', label: '회사명', type: 'text' },
    { 
      key: 'logDetails', 
      label: '변경 내용', 
      type: 'custom',
      render: (value, row) => {
        if (!value || value.length === 0) {
          return <span style={{ color: '#999' }}>-</span>;
        }
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShowDetails(row.logDetails);
            }}
            style={{
              background: '#1a1a1a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              ':hover': {
                background: '#3d3d3d',
                transform: 'translateY(-1px)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
              }
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#3d3d3d';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#1a1a1a';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            상세보기
          </button>
        );
      }
    },
  ];

  // 액션 필터 옵션
  const actionFilterOptions = [
    { label: '전체', value: '' },
    { label: '생성', value: 'CREATE' },
    { label: '수정', value: 'MODIFY' },
    { label: '삭제', value: 'DELETE' },
  ];

  // 액션 대상타입 필터 옵션 (8개로 확장)
  const targetTypeFilterOptions = [
    { label: '전체', value: '' },
    { label: '게시글', value: 'POST' },
    { label: '리뷰', value: 'REVIEW' },
    { label: '프로젝트 체크리스트', value: 'PROJECT_CHECK_LIST' },
    { label: '회원', value: 'MEMBER' },
    { label: '회사', value: 'COMPANY' },
    { label: '프로젝트', value: 'PROJECT' },
    { label: '프로젝트 단계', value: 'PROJECT_STEP' },
    { label: '프로젝트 멤버', value: 'PROJECT_MEMBER' },
  ];

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage)); // 이제 모두 1-based
  };

  // 필터 변경 핸들러
  const handleActionFilterChange = (value) => {
    dispatch(setActionTypeFilter(value));
  };

  const handleTargetTypeFilterChange = (value) => {
    dispatch(setTargetTypeFilter(value));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <CustomTable
        columns={columns}
        rows={activityLogs}
        pagination={{
          page: currentPage,
          total: totalCount,
          onPageChange: handlePageChange,
          pageSize: 10,
        }}
        filter={{
          key: 'actionType',
          label: '액션',
          value: actionTypeFilter,
          options: actionFilterOptions,
          onChange: handleActionFilterChange,
        }}
        secondaryFilter={{
          key: 'targetType',
          label: '대상 타입',
          value: targetTypeFilter,
          options: targetTypeFilterOptions,
          onChange: handleTargetTypeFilterChange,
        }}
        hideDeleteButton={true}
      />

      <Dialog 
        open={detailsOpen} 
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            변경 내용 상세보기
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedLogDetails.length === 0 ? (
            <Typography variant="body1" color="text.secondary" textAlign="center" py={3}>
              변경된 내용이 없습니다.
            </Typography>
          ) : (
            <Box>
              {selectedLogDetails.map((detail, index) => {
                // fieldType을 한글로 변환
                const getFieldTypeLabel = (fieldType) => {
                  const fieldTypeMap = {
                    'PROJECT_NAME': '프로젝트명',
                    'PROJECT_DETAIL': '프로젝트 상세',
                    'PROJECT_START_AT': '시작일',
                    'PROJECT_END_AT': '종료일',
                    'PROJECT_STATUS': '프로젝트 상태',
                    'MEMBER_NAME': '회원명',
                    'MEMBER_EMAIL': '이메일',
                    'MEMBER_ROLE': '권한',
                    'COMPANY_NAME': '회사명',
                    'COMPANY_TYPE': '회사 유형',
                    'POST_TITLE': '게시글 제목',
                    'POST_CONTENT': '게시글 내용',
                    'REVIEW_COMMENT': '리뷰 내용',
                    'STEP_NAME': '단계명',
                    'STEP_STATUS': '단계 상태',
                    'CHECKLIST_ITEM': '체크리스트 항목',
                    'CHECKLIST_STATUS': '체크리스트 상태'
                  };
                  return fieldTypeMap[fieldType] || fieldType;
                };

                const fieldLabel = getFieldTypeLabel(detail.fieldType);
                const oldValue = detail.oldValue || '-';
                const newValue = detail.newValue || '-';

                return (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip 
                        label={fieldLabel} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2,
                      bgcolor: 'grey.50',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'grey.200'
                    }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          이전 값
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          wordBreak: 'break-word',
                          color: oldValue === '-' ? 'text.disabled' : 'text.primary'
                        }}>
                          {oldValue}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: 'primary.main',
                        fontWeight: 'bold'
                      }}>
                        →
                      </Box>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          변경된 값
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          wordBreak: 'break-word',
                          color: newValue === '-' ? 'text.disabled' : 'text.primary'
                        }}>
                          {newValue}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {index < selectedLogDetails.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </Box>
                );
              })}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={handleCloseDetails}
            variant="contained"
            size="small"
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LogsTable; 