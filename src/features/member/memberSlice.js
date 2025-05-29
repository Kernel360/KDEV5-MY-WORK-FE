import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as memberAPI from "@/api/member";

export const fetchMembers = createAsyncThunk(
  "member/fetchMembers",
  async (_, thunkAPI) => {
    try {
      const response = await memberAPI.getMembers();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

const memberSlice = createSlice({
  name: "member",
  initialState: {
    data: [],
    current: null,
  },
  reducers: {
    clearCurrentMember(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMembers.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const { clearCurrentMember } = memberSlice.actions;
export default memberSlice.reducer;
