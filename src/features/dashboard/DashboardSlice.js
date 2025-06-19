// src/features/dashboard/dashboardSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as dashboardAPI from "@/api/dashboard";

// 대시보드 총 요약 정보 조회
export const fetchDashboardSummary = createAsyncThunk(
  "dashboard/fetchSummary",
  async (_, thunkAPI) => {
    try {
      const response = await dashboardAPI.getDashboardTotalSummary();
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "대시보드 요약 정보 조회 실패"
      );
    }
  }
);

export const fetchNearDeadlineProjects = createAsyncThunk(
  "dashboard/fetchNearDeadlineProjects",
  async ({ page }, thunkAPI) => {
    try {
      const response = await dashboardAPI.getNearDeadlineProjects({ page });
      const { projects, totalCount } = response.data.data;
      return { projects, totalCount, currentPage: page };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "마감 임박 프로젝트 목록 조회 실패"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    summary: null,
    summaryLoading: false,
    summaryError: null,

    nearDeadline: [],
    nearDeadlineTotalCount: 0,
    nearDeadlineCurrentPage: 1,
    nearDeadlineLoading: false,
    nearDeadlineError: null,
  },
  reducers: {
    clearDashboardState(state) {
      state.summary = null;
      state.summaryError = null;

      state.nearDeadline = [];
      state.nearDeadlineError = null;
      state.nearDeadlineTotalCount = 0;
      state.nearDeadlineCurrentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // 총 요약 정보
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.payload;
      })

      // 마감 임박 프로젝트
      .addCase(fetchNearDeadlineProjects.pending, (state) => {
        state.nearDeadlineLoading = true;
        state.nearDeadlineError = null;
      })
      .addCase(fetchNearDeadlineProjects.fulfilled, (state, action) => {
        state.nearDeadlineLoading = false;
        state.nearDeadline = action.payload.projects;
        state.nearDeadlineTotalCount = action.payload.totalCount;
        state.nearDeadlineCurrentPage = action.payload.currentPage;
      })
      .addCase(fetchNearDeadlineProjects.rejected, (state, action) => {
        state.nearDeadlineLoading = false;
        state.nearDeadlineError = action.payload;
      });
  },
});

export const { clearDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
