import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as companyAPI from "@/api/company";

export const fetchCompanies = createAsyncThunk(
  "company/fetchCompanies",
  async (_, thunkAPI) => {
    try {
      const response = await companyAPI.getCompanies();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    data: [],
    current: null,
  },
  reducers: {
    clearCurrentCompany(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCompanies.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export const { clearCurrentCompany } = companySlice.actions;
export default companySlice.reducer;
