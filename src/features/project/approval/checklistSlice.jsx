// src/features/checklist/checklistSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCheckList,
  getCheckListById,
  updateCheckList,
  deleteCheckList,
  approveCheckList,
  getCheckListProgress,
  getCheckLists,
} from "@/api/checklist";

// 체크리스트 생성
export const createCheckListThunk = createAsyncThunk(
  "checklist/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createCheckList(data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 체크리스트 상세 조회
export const getCheckListByIdThunk = createAsyncThunk(
  "checklist/getById",
  async (checkListId, { rejectWithValue }) => {
    try {
      const res = await getCheckListById(checkListId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 체크리스트 수정
export const updateCheckListThunk = createAsyncThunk(
  "checklist/update",
  async (data, { rejectWithValue }) => {
    try {
      const res = await updateCheckList(data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 체크리스트 삭제
export const deleteCheckListThunk = createAsyncThunk(
  "checklist/delete",
  async (checkListId, { rejectWithValue }) => {
    try {
      const res = await deleteCheckList(checkListId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 체크리스트 승인 (결재)
export const approveCheckListThunk = createAsyncThunk(
  "checklist/approve",
  async ({ checklistId, data }, { rejectWithValue }) => {
    try {
      const res = await approveCheckList(checklistId, data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 체크리스트 진행률 조회
export const fetchChecklistProgress = createAsyncThunk(
  "checklist/fetchProgress",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await getCheckListProgress(projectId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 체크리스트 목록 조회
export const fetchChecklistItems = createAsyncThunk(
  "checklist/fetchItems",
  async ({ projectId, projectStepId }, { rejectWithValue }) => {
    try {
      const res = await getCheckLists(projectId, projectStepId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const checklistSlice = createSlice({
  name: "checklist",
  initialState: {
    current: null,
    creating: false,
    updating: false,
    deleting: false,
    approving: false,
    progressList: [],
    checklistItems: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearChecklistState: (state) => {
      state.current = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckListThunk.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createCheckListThunk.fulfilled, (state, action) => {
        state.creating = false;
        state.current = action.payload;
      })
      .addCase(createCheckListThunk.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      .addCase(getCheckListByIdThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(getCheckListByIdThunk.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(getCheckListByIdThunk.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateCheckListThunk.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateCheckListThunk.fulfilled, (state, action) => {
        state.updating = false;
        state.current = action.payload;
      })
      .addCase(updateCheckListThunk.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      .addCase(deleteCheckListThunk.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteCheckListThunk.fulfilled, (state) => {
        state.deleting = false;
        state.current = null;
      })
      .addCase(deleteCheckListThunk.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })

      .addCase(approveCheckListThunk.pending, (state) => {
        state.approving = true;
        state.error = null;
      })
      .addCase(approveCheckListThunk.fulfilled, (state, action) => {
        state.approving = false;
        state.current = action.payload;
      })
      .addCase(approveCheckListThunk.rejected, (state, action) => {
        state.approving = false;
        state.error = action.payload;
      })

      .addCase(fetchChecklistProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChecklistProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progressList = action.payload.projectCheckListProgress || [];
      })
      .addCase(fetchChecklistProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchChecklistItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChecklistItems.fulfilled, (state, action) => {
        console.log("action", action);
        state.loading = false;
        state.checklistItems = action.payload.projectCheckLists || [];
      })
      .addCase(fetchChecklistItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearChecklistState } = checklistSlice.actions;
export default checklistSlice.reducer;
