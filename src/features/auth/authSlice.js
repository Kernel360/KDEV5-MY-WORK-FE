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

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await authAPI.logout();
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

const storedToken = localStorage.getItem("accessToken");
const storedExpiresAt = localStorage.getItem("expiresAt");
const storedUserJson = localStorage.getItem("user");
const initialUser = storedUserJson ? JSON.parse(storedUserJson) : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,                
    accessToken: storedToken || null, 
    expiresAt: storedExpiresAt || null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearAuthState(state) {
      state.user = null;
      state.accessToken = null;
      state.expiresAt = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("expiresAt");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      // === LOGIN ===
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error  = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status      = "succeeded";
        state.accessToken = action.payload.accessToken;
        state.expiresAt   = action.payload.expiresAt;
        state.user = {
          id:   action.payload.memberId,
          name: action.payload.memberName,
          role: action.payload.memberRole,
        };
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("expiresAt",   action.payload.expiresAt);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id:   action.payload.memberId,
            name: action.payload.memberName,
            role: action.payload.memberRole,
          })
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error  = action.payload;
      })

      // === REISSUE TOKEN ===
      .addCase(reissueToken.pending, (state) => {
        state.status = "loading";
        state.error  = null;
      })
      .addCase(reissueToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        state.expiresAt   = action.payload.expiresAt;
        state.status      = "succeeded";
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("expiresAt",   action.payload.expiresAt);
      })
      .addCase(reissueToken.rejected, (state, action) => {
        state.status = "failed";
        state.error  = action.payload;
      })

      // === LOGOUT ===
      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error  = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status      = "idle";
        state.user        = null;
        state.accessToken = null;
        state.expiresAt   = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("expiresAt");
        localStorage.removeItem("user");
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error  = action.payload;
      });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
