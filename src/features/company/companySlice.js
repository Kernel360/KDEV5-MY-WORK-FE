import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as companyAPI from "@/api/company";
import { getCompanyListOnlyIdName } from "@/api/company";

export const fetchCompanies = createAsyncThunk(
  "company/fetchCompanies",
  async ({ page, companyType, keyword, keywordType, deleted }, thunkAPI) => {
    try {
      const response = await companyAPI.getCompanies({
        page,
        companyType,
        keyword,
        keywordType,
        deleted,
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const createCompanyId = createAsyncThunk(
  "company/generateCompanyId",
  async (_, thunkAPI) => {
    try {
      const response = await companyAPI.generateCompanyId();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const fetchCompanyById = createAsyncThunk(
  "company/fetchCompanyById",
  async (id, thunkAPI) => {
    try {
      const response = await companyAPI.getCompanyById(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const createCompany = createAsyncThunk(
  "company/fetchCompanyById",
  async (data, thunkAPI) => {
    try {
      const response = await companyAPI.updateCompany(data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async (id, data, thunkAPI) => {
    try {
      const response = await companyAPI.updateCompany(id, data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (id, thunkAPI) => {
    try {
      const response = await companyAPI.deleteCompany(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

// 회사 ID/이름만 가져오는 thunk
export const fetchCompanyListOnlyIdName = createAsyncThunk(
  "company/fetchCompanyListOnlyIdName",
  async (_, thunkAPI) => {
    try {
      const response = await getCompanyListOnlyIdName();
      return response.data.data; // { companies: [...] }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState: {
    list: [],
    current: null,
    error: null,
    companyListOnlyIdName: [], // 새로 추가
  },
  reducers: {
    clearCurrentCompany(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //  ===== 목록 조회 =====
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data.companies;
        state.totalCount = action.payload.data.totalCount;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // 회사 ID/이름만 가져오는 thunk
      .addCase(fetchCompanyListOnlyIdName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyListOnlyIdName.fulfilled, (state, action) => {
        state.companyListOnlyIdName = action.payload.companies;
        state.loading = false;
      })
      .addCase(fetchCompanyListOnlyIdName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentCompany } = companySlice.actions;
export default companySlice.reducer;
