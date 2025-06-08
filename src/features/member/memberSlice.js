import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as memberAPI from "@/api/member";

export const fetchMembers = createAsyncThunk(
  "member/fetchMembers",
  async ({ page, keyword, keywordType }, thunkAPI) => {
    try {
      const response = await memberAPI.findMembers(page, keyword, keywordType);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

const memberSlice = createSlice({
  name: "member",
  initialState: {
    list: [],
    current: null,
    loading: false,
    error: null,
    totalCount: 0,
  },
  reducers: {
    clearCurrentMember(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMembers.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchMembers.fulfilled, (state, action) => {
      state.list = action.payload.members;
      state.totalCount = action.payload.totalCount;
      state.loading = false;
    })
    .addCase(fetchMembers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearCurrentMember } = memberSlice.actions;
export default memberSlice.reducer;
