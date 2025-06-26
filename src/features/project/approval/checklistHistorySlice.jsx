// src/features/checklist/checklistHistorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCheckListHistories } from "@/api/checklistHistory";

/**
 * 체크리스트 이력 목록 조회 Thunk
 * @param {string} checkListId
 */
export const fetchCheckListHistories = createAsyncThunk(
  "checklistHistory/fetch",
  async (checkListId, { rejectWithValue }) => {
    try {
      const res = await getCheckListHistories(checkListId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const checklistHistorySlice = createSlice({
  name: "checklistHistory",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearChecklistHistoryState: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCheckListHistories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCheckListHistories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCheckListHistories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearChecklistHistoryState } = checklistHistorySlice.actions;
export default checklistHistorySlice.reducer;
