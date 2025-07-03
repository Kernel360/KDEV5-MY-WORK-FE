import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as logsAPI from './api/logsApi';

// ActivityLog 목록 조회 (필터 파라미터 추가)
export const fetchActivityLogs = createAsyncThunk(
  'logs/fetchActivityLogs',
  async ({ page = 1, actionType = '', targetType = '' }, thunkAPI) => {
    try {
      const response = await logsAPI.getActivityLogs(page, actionType, targetType);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Activity logs 조회 실패');
    }
  }
);

const logsSlice = createSlice({
  name: 'logs',
  initialState: {
    activityLogs: [],
    totalCount: 0,
    currentPage: 1, // 1-based로 변경
    actionTypeFilter: '', // 액션 타입 필터 상태
    targetTypeFilter: '', // 대상 타입 필터 상태
    loading: false,
    error: null,
  },
  reducers: {
    clearLogsError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setActionTypeFilter: (state, action) => {
      state.actionTypeFilter = action.payload;
      state.currentPage = 1; // 필터 변경시 첫 페이지로
    },
    setTargetTypeFilter: (state, action) => {
      state.targetTypeFilter = action.payload;
      state.currentPage = 1; // 필터 변경시 첫 페이지로
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchActivityLogs
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.activityLogs = action.payload.activityLogSelectWebResponses || [];
        state.totalCount = action.payload.totalCount || 0;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearLogsError, 
  setCurrentPage, 
  setActionTypeFilter, 
  setTargetTypeFilter 
} = logsSlice.actions;
export default logsSlice.reducer; 