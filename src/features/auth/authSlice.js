// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authAPI from "@/api/auth";

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const reissueToken = createAsyncThunk(
  "auth/reissueToken",
  async (_, thunkAPI) => {
    try {
      const response = await authAPI.reissueToken();
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Reissue failed");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await authAPI.logout();
    return true;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || "Logout failed");
  }
});

const storedToken = localStorage.getItem("accessToken");
const storedUserJson = localStorage.getItem("user");
const storedCompanyJson = localStorage.getItem("company");
const initialUser = storedUserJson ? JSON.parse(storedUserJson) : null;
const initialCompany = storedCompanyJson ? JSON.parse(storedCompanyJson) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    company: initialCompany,
    accessToken: storedToken || null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearAuthState(state) {
      state.user = null;
      state.company = null;
      state.accessToken = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      localStorage.removeItem("company");
    },
  },
  extraReducers: (builder) => {
    builder
      // === LOGIN ===
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.accessToken = payload.accessToken;
        state.user = {
          id: payload.memberId,
          name: payload.memberName,
          role: payload.memberRole,
        };
        state.company = {
          id: payload.companyId,
          name: payload.companyName,
          logoImagePath: payload.logoImagePath,
          type: payload.companyType,
        };

        localStorage.setItem("accessToken", payload.accessToken);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: payload.memberId,
            name: payload.memberName,
            role: payload.memberRole,
          })
        );
        localStorage.setItem(
          "company",
          JSON.stringify({
            id: payload.companyId,
            name: payload.companyName,
            logoImagePath: payload.logoImagePath,
            type: payload.companyType,
          })
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // === REISSUE TOKEN ===
      .addCase(reissueToken.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(reissueToken.fulfilled, (state, { payload }) => {
        state.status = "succeeded";
        state.accessToken = payload.accessToken;
        state.user = {
          id: payload.memberId,
          name: payload.memberName,
          role: payload.memberRole,
        };
        state.company = {
          id: payload.companyId,
          name: payload.companyName,
          logoImagePath: payload.logoImagePath,
          type: payload.companyType,
        };

        localStorage.setItem("accessToken", payload.accessToken);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: payload.memberId,
            name: payload.memberName,
            role: payload.memberRole,
          })
        );
        localStorage.setItem(
          "company",
          JSON.stringify({
            id: payload.companyId,
            name: payload.companyName,
            logoImagePath: payload.logoImagePath,
            type: payload.companyType,
          })
        );
      })
      .addCase(reissueToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // === LOGOUT ===
      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.company = null;
        state.accessToken = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("company");
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
export const getAccessToken = (state) => state.auth.accessToken;
export const getUser = (state) => state.auth.user;
